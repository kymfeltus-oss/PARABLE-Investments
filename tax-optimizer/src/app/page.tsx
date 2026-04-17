"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import {
  type CoreProfileKey,
  defaultSnapshotForYear,
  FORM_1040_LINE_ROWS,
  type Form1040LineId,
  type Form1040Snapshot,
  mergeForm1040Snapshots,
  reconcileForm1040Snapshot,
  rollupTotalPayments,
  snapshotToCoreProfile,
} from "@/lib/form-1040-snapshot";
import { parseTaxDataFromText } from "@/lib/parse-tax-document";
import {
  type FilingStatus,
  type TaxBracket,
  FILING_STATUS_OPTIONS,
  getSupportedTaxYears,
  getTaxYearConfig,
} from "@/lib/tax-year-data";

type UploadState = {
  fileName: string;
  parsed: Partial<Form1040Snapshot>;
  message: string;
};

type FieldAdjustment = {
  id: Form1040LineId;
  label: string;
  from: number;
  to: number;
};

const CORE_PROFILE_FIELDS: Array<{ key: CoreProfileKey; label: string }> = [
  { key: "wages", label: "Wages (Line 1a)" },
  { key: "agi", label: "Adjusted gross income (Lines 11a / 11b)" },
  { key: "taxableIncome", label: "Taxable income (Line 15)" },
  { key: "taxAssessed", label: "Total tax (Line 24)" },
  { key: "federalWithholding", label: "Federal withholding (Line 25d)" },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function toCurrency(value: number): string {
  return currency.format(value);
}

function toDisplayNumber(value: number): string {
  return Number.isNaN(value) ? "0" : Math.max(0, Math.round(value)).toString();
}

function parsePositiveNumber(raw: string): number {
  const value = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

/** Commit a finished Line 8 value (Schedule 1 can be negative). */
function finalizeSignedMoney(raw: string): number {
  const t = raw.trim().replace(/\$/g, "");
  if (t === "" || t === "-" || t === "+") {
    return 0;
  }
  const value = Number(t.replace(/,/g, ""));
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value);
}

/** Allow typing "-" / partial decimals without snapping to 0 mid-edit. */
function tryParseSignedMoney(raw: string): number | undefined {
  const t = raw.trim().replace(/\$/g, "");
  if (
    t === "" ||
    t === "-" ||
    t === "+" ||
    t === "." ||
    t === "-." ||
    t === "+."
  ) {
    return undefined;
  }
  const value = Number(t.replace(/,/g, ""));
  if (!Number.isFinite(value)) {
    return undefined;
  }
  return Math.round(value);
}

function formatDelta(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  return `${sign}${toCurrency(abs)}`;
}

function computeTaxHoH(brackets: TaxBracket[], taxableIncome: number): number {
  const income = Math.max(0, taxableIncome);
  let tax = 0;
  let floor = 0;

  for (const bracket of brackets) {
    const segmentUpper = Math.min(income, bracket.ceiling);
    const taxableSegment = Math.max(0, segmentUpper - floor);
    tax += taxableSegment * bracket.rate;

    if (income <= bracket.ceiling) {
      break;
    }
    floor = bracket.ceiling;
  }
  return tax;
}

function inverseTaxHoH(brackets: TaxBracket[], targetTax: number): number {
  const desiredTax = Math.max(0, targetTax);
  let cumulativeTax = 0;
  let floor = 0;

  for (const bracket of brackets) {
    if (!Number.isFinite(bracket.ceiling)) {
      return floor + (desiredTax - cumulativeTax) / bracket.rate;
    }

    const span = bracket.ceiling - floor;
    const bracketTax = span * bracket.rate;
    if (desiredTax <= cumulativeTax + bracketTax) {
      return floor + (desiredTax - cumulativeTax) / bracket.rate;
    }

    cumulativeTax += bracketTax;
    floor = bracket.ceiling;
  }
  return 0;
}

function bracketForIncome(
  brackets: TaxBracket[],
  taxableIncome: number,
): TaxBracket {
  const income = Math.max(0, taxableIncome);
  return (
    brackets.find((bracket) => income <= bracket.ceiling) ??
    brackets[brackets.length - 1]
  );
}

type PdfTextRun = { str: string; x: number; y: number };

function runsFromTextContent(items: unknown[]): PdfTextRun[] {
  const runs: PdfTextRun[] = [];
  for (const raw of items) {
    if (!raw || typeof raw !== "object" || !("str" in raw)) {
      continue;
    }
    const item = raw as { str?: string; transform?: number[] };
    const str = typeof item.str === "string" ? item.str : "";
    if (!str.trim()) {
      continue;
    }
    const tr = item.transform;
    const x = Array.isArray(tr) && tr.length >= 6 ? tr[4] : 0;
    const y = Array.isArray(tr) && tr.length >= 6 ? tr[5] : 0;
    runs.push({ str, x, y });
  }
  return runs;
}

/**
 * IRS Form 1040 PDFs emit each glyph/word as separate runs. Joining in arbitrary
 * order breaks "1a" + "597". Cluster by Y (same row) then sort by X (left→right).
 */
function clusterRunsIntoLines(runs: PdfTextRun[], yTolerance = 5): string[] {
  if (runs.length === 0) {
    return [];
  }
  const sorted = [...runs].sort((a, b) => b.y - a.y || a.x - b.x);
  const lines: PdfTextRun[][] = [];
  for (const run of sorted) {
    const line = lines.find(
      (L) => L.length > 0 && Math.abs(L[0].y - run.y) <= yTolerance,
    );
    if (line) {
      line.push(run);
    } else {
      lines.push([run]);
    }
  }
  return lines.map((line) =>
    [...line]
      .sort((a, b) => a.x - b.x)
      .map((r) => r.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  /** Same-origin worker avoids CDN blocks and fixes silent parse failures. */
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const layoutLines: string[] = [];
  const flatChunks: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const items = textContent.items as unknown[];
    const runs = runsFromTextContent(items);
    const lines = clusterRunsIntoLines(runs, 5);
    layoutLines.push(...lines);
    flatChunks.push(
      runs
        .map((r) => r.str)
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    );
  }

  const layoutText = layoutLines.join("\n");
  const flatText = flatChunks.join("\n\n");
  /** Layout-first so Line 1a + amount stay on one logical row; keep flat as fallback. */
  return `${layoutText}\n\n---FLAT---\n\n${flatText}`;
}

const SUPPORTED_TAX_YEARS = getSupportedTaxYears();

export default function Home() {
  const [taxYear, setTaxYear] = useState(2021);
  const [filingStatus, setFilingStatus] =
    useState<FilingStatus>("head_of_household");
  const yearConfig = useMemo(
    () =>
      getTaxYearConfig(taxYear, filingStatus) ??
      getTaxYearConfig(2021, filingStatus)!,
    [taxYear, filingStatus],
  );
  const filingStatusLabel = useMemo(
    () =>
      FILING_STATUS_OPTIONS.find((o) => o.value === filingStatus)?.label ??
      filingStatus,
    [filingStatus],
  );
  const standardDeduction = yearConfig.standardDeduction;
  const taxBrackets = yearConfig.brackets;

  const [sourceSnapshot, setSourceSnapshot] = useState<Form1040Snapshot>(() =>
    reconcileForm1040Snapshot(defaultSnapshotForYear(2021)),
  );
  const sourceProfile = useMemo(
    () => snapshotToCoreProfile(sourceSnapshot),
    [sourceSnapshot],
  );
  const [originalFile, setOriginalFile] = useState<UploadState | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<UploadState | null>(null);
  const [intakeStatus, setIntakeStatus] = useState(
    "Select tax year, then upload documents (optional) and click Merge Intake Data.",
  );
  const [adjustments, setAdjustments] = useState<FieldAdjustment[]>([]);
  const [businessExpenses, setBusinessExpenses] = useState(0);
  const [itemizedDeductions, setItemizedDeductions] = useState(0);
  const [zeroBalanceGoal, setZeroBalanceGoal] = useState(false);
  const [refundMaximizer, setRefundMaximizer] = useState(false);
  const [exportSummary, setExportSummary] = useState("");
  const [mergeGeneration, setMergeGeneration] = useState(0);
  /** Draft string while editing Line 8 so "-" and partial input are not coerced to 0. */
  const [line8Draft, setLine8Draft] = useState<string | null>(null);

  /** As-filed: total payments (25d+25e+27+32) minus Line 24; refund if positive, else amount due. */
  const asFiledRefundOrDue = useMemo(() => {
    const pay = rollupTotalPayments(sourceSnapshot);
    return pay - sourceSnapshot["24"];
  }, [sourceSnapshot]);

  const line37Reconciliation = useMemo(() => {
    const pay = rollupTotalPayments(sourceSnapshot);
    const l24 = sourceSnapshot["24"];
    const expected = Math.max(0, Math.round(l24 - pay));
    const l37 = Math.round(sourceSnapshot["37"]);
    const tol = Math.max(5, Math.round(0.02 * Math.max(expected, l37, 1)));
    const match = Math.abs(l37 - expected) <= tol;
    return { pay, l24, expected, match };
  }, [sourceSnapshot]);

  const deductionUsed = Math.max(standardDeduction, itemizedDeductions);
  const correctedAgi = Math.max(0, sourceProfile.agi - businessExpenses);
  const correctedTaxableIncome = Math.max(0, correctedAgi - deductionUsed);
  const correctedTax = computeTaxHoH(taxBrackets, correctedTaxableIncome);
  const taxChange = correctedTax - sourceProfile.taxAssessed;
  const refundOrBalance = sourceProfile.federalWithholding - correctedTax;
  const currentBracket = bracketForIncome(taxBrackets, correctedTaxableIncome);
  const originalBracket = bracketForIncome(taxBrackets, sourceProfile.taxableIncome);

  const zeroBalanceTargetTaxable = useMemo(
    () => inverseTaxHoH(taxBrackets, sourceProfile.federalWithholding),
    [taxBrackets, sourceProfile.federalWithholding],
  );
  const zeroBalanceReductionNeeded = Math.max(
    0,
    sourceProfile.taxableIncome - zeroBalanceTargetTaxable,
  );
  const tenPercentUpperLimit = taxBrackets[0].ceiling;
  const refundMaxReductionNeeded = Math.max(
    0,
    sourceProfile.taxableIncome - tenPercentUpperLimit,
  );

  const onTaxYearChange = (nextYear: number): void => {
    setTaxYear(nextYear);
    setLine8Draft(null);
    setSourceSnapshot(
      reconcileForm1040Snapshot(defaultSnapshotForYear(nextYear)),
    );
    setOriginalFile(null);
    setTranscriptFile(null);
    setAdjustments([]);
    setBusinessExpenses(0);
    setItemizedDeductions(0);
    setZeroBalanceGoal(false);
    setRefundMaximizer(false);
    setExportSummary("");
    setIntakeStatus(
      nextYear === 2021
        ? "2021 demo transcript figures loaded. Upload to override, then merge."
        : `${nextYear} selected: baseline is zero until you upload/merge or enter data elsewhere.`,
    );
  };

  const handleUpload = async (
    file: File,
    kind: "original" | "transcript",
  ): Promise<void> => {
    const fileName = file.name;
    const setUpload =
      kind === "original" ? setOriginalFile : setTranscriptFile;

    /** Record the file immediately so Merge sees an upload even if PDF read fails. */
    setUpload({
      fileName,
      parsed: {},
      message: `Reading ${fileName}…`,
    });
    setIntakeStatus(`Reading ${fileName}…`);

    try {
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const text = isPdf ? await extractTextFromPdf(file) : await file.text();
      const parsed = parseTaxDataFromText(text);

      const parsedIds = Object.keys(parsed) as Form1040LineId[];
      const parsedFields = parsedIds.filter(
        (id) => parsed[id] !== undefined,
      ).length;

      const labelById = new Map(
        FORM_1040_LINE_ROWS.map((r) => [r.id, r.label] as const),
      );
      const detailParts = parsedIds
        .filter((id) => parsed[id] !== undefined)
        .slice(0, 12)
        .map(
          (id) =>
            `${id}: ${labelById.get(id) ?? id} — ${toCurrency(parsed[id]!)}`,
        );

      const message =
        parsedFields === 0
          ? `Loaded ${fileName}. No dollar fields matched — use manual fields after Merge, or try a text-based PDF / .txt.`
          : `Parsed ${parsedFields} field(s) from ${fileName}${detailParts.length ? ` — ${detailParts.join("; ")}` : ""}`;
      setUpload({ fileName, parsed, message });
      setIntakeStatus(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const failMessage = `Could not read ${fileName}: ${errorMessage}. You can still click Merge and enter figures manually below.`;
      setUpload({
        fileName,
        parsed: {},
        message: failMessage,
      });
      setIntakeStatus(failMessage);
    }
  };

  const onSelectOriginal = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await handleUpload(file, "original");
  };

  const onSelectTranscript = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await handleUpload(file, "transcript");
  };

  const applyMergedData = (): void => {
    setLine8Draft(null);
    const hasOriginal = Boolean(originalFile);
    const hasTranscript = Boolean(transcriptFile);

    if (!hasOriginal && !hasTranscript) {
      setSourceSnapshot(
        reconcileForm1040Snapshot(defaultSnapshotForYear(taxYear)),
      );
      setAdjustments([]);
      setIntakeStatus(
        `No uploads found. Restored default baseline for ${taxYear}.`,
      );
      return;
    }

    const { merged, adjustments: nextAdjustments } = mergeForm1040Snapshots(
      defaultSnapshotForYear(taxYear),
      originalFile?.parsed,
      transcriptFile?.parsed,
    );

    setSourceSnapshot(merged);
    setAdjustments(nextAdjustments);
    setMergeGeneration((g) => g + 1);
    setZeroBalanceGoal(false);
    setRefundMaximizer(false);
    setBusinessExpenses(0);
    setItemizedDeductions(0);

    if (hasOriginal && hasTranscript) {
      if (nextAdjustments.length === 0) {
        setIntakeStatus(
          "Merged: original + transcript agree on parsed lines. Active figures updated — see Merged return snapshot below.",
        );
      } else {
        setIntakeStatus(
          `Merged: applied ${nextAdjustments.length} transcript override(s). Active figures updated — see snapshot below.`,
        );
      }
      return;
    }

    if (hasTranscript) {
      setIntakeStatus(
        "Merged transcript into baseline. Check snapshot below; fill gaps manually if needed.",
      );
    } else {
      setIntakeStatus(
        "Merged original return into baseline. Check snapshot below; fill gaps manually if needed.",
      );
    }
  };

  const setSnapshotLine = (id: Form1040LineId, raw: string): void => {
    if (id === "37" || id === "37a") {
      return;
    }
    const n = parsePositiveNumber(raw);
    setSourceSnapshot((prev) =>
      reconcileForm1040Snapshot({ ...prev, [id]: n }),
    );
    setMergeGeneration((g) => g + 1);
  };

  /** Re-run tie-out (payments rollup, refund Line 35 / Lines 37–37a, AGI mirror). */
  const recalculateMergedSnapshot = (): void => {
    setLine8Draft(null);
    try {
      setSourceSnapshot((prev) => ({
        ...reconcileForm1040Snapshot({ ...prev }),
      }));
      setMergeGeneration((g) => g + 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error during reconcile.";
      setIntakeStatus(`Recalculate failed: ${message}`);
    }
  };

  const handleGoalToggle = (enabled: boolean): void => {
    setZeroBalanceGoal(enabled);
    if (enabled) {
      setRefundMaximizer(false);
      setBusinessExpenses(zeroBalanceReductionNeeded);
      setItemizedDeductions(0);
    }
  };

  const handleRefundMaxToggle = (enabled: boolean): void => {
    setRefundMaximizer(enabled);
    if (enabled) {
      setZeroBalanceGoal(false);
      setBusinessExpenses(refundMaxReductionNeeded);
      setItemizedDeductions(0);
    }
  };

  const export1040x = (): void => {
    const snapshotLines = FORM_1040_LINE_ROWS.map(
      (row) =>
        `Line ${row.id}\t${row.label}\t${toCurrency(sourceSnapshot[row.id])}`,
    );
    const lines = [
      `${taxYear} FORM 1040-X AMENDMENT WORKSHEET`,
      "",
      "Merged Form 1040 snapshot (amounts used as-filed baseline)",
      "",
      ...snapshotLines,
      "",
      `--- What-if scenario (${filingStatusLabel}) ---`,
      "",
      `Tax year (brackets + standard deduction): ${taxYear} | ${filingStatusLabel}`,
      yearConfig.provisional
        ? "Note: Tax year tables marked provisional in app (verify against IRS)."
        : "",
      "",
      `Adjusted Gross Income | Original: ${toCurrency(sourceProfile.agi)} | Corrected: ${toCurrency(correctedAgi)} | Change: ${formatDelta(correctedAgi - sourceProfile.agi)}`,
      `Taxable Income      | Original: ${toCurrency(sourceProfile.taxableIncome)} | Corrected: ${toCurrency(correctedTaxableIncome)} | Change: ${formatDelta(correctedTaxableIncome - sourceProfile.taxableIncome)}`,
      `Tax Liability       | Original: ${toCurrency(sourceProfile.taxAssessed)} | Corrected: ${toCurrency(correctedTax)} | Change: ${formatDelta(correctedTax - sourceProfile.taxAssessed)}`,
      `Federal Withholding | Original: ${toCurrency(sourceProfile.federalWithholding)} | Corrected: ${toCurrency(sourceProfile.federalWithholding)} | Change: +$0.00`,
      "",
      `Business Expenses (Schedule C): ${toCurrency(businessExpenses)}`,
      `Itemized Deductions (Schedule A): ${toCurrency(itemizedDeductions)}`,
      `Deduction Applied (greater of standard vs itemized): ${toCurrency(deductionUsed)}`,
      `Filing status and tax table: ${filingStatusLabel} (${taxYear} IRS ordinary income brackets)`,
      "",
      refundOrBalance >= 0
        ? `Estimated Refund: ${toCurrency(refundOrBalance)}`
        : `Estimated Balance Due: ${toCurrency(Math.abs(refundOrBalance))}`,
      "",
      "Generated by Tax Optimizer dashboard.",
    ].filter(Boolean);

    const summary = lines.join("\n");
    setExportSummary(summary);

    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${taxYear}_1040X_summary.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 p-8 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-blue-200">
            Tax Optimizer — multi-year, filing-status aware
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Amendment Intake + What-If Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-200">
            Step 0: Choose tax year and filing status (matches your Form 1040).
            Step 1: Upload original return and/or transcript. Step 2: merge with
            transcript overrides. Step 3: run optimizer features.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <span className="font-medium text-blue-100">Tax year</span>
              <select
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-300"
                value={taxYear}
                onChange={(event) =>
                  onTaxYearChange(Number.parseInt(event.target.value, 10))
                }
              >
                {SUPPORTED_TAX_YEARS.map((y) => (
                  <option key={y} value={y} className="text-slate-900">
                    {y}
                    {getTaxYearConfig(y)?.provisional ? " (provisional)" : ""}
                  </option>
                ))}
              </select>
            </label>
            {yearConfig.provisional ? (
              <span className="text-xs text-amber-200">
                Provisional: brackets/standard deduction mirror {taxYear - 1}{" "}
                until IRS publishes {taxYear} tables.
              </span>
            ) : null}
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <span className="font-medium text-blue-100">Filing status</span>
              <select
                className="max-w-[min(100vw-2rem,22rem)] rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-300"
                value={filingStatus}
                onChange={(event) =>
                  setFilingStatus(event.target.value as FilingStatus)
                }
              >
                {FILING_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div
            key={mergeGeneration}
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            <Metric label="Active AGI" value={toCurrency(sourceProfile.agi)} />
            <Metric
              label="Active Taxable Income"
              value={toCurrency(sourceProfile.taxableIncome)}
            />
            <Metric
              label="Active Tax Assessed"
              value={toCurrency(sourceProfile.taxAssessed)}
            />
            <Metric label="Active Wages" value={toCurrency(sourceProfile.wages)} />
            <Metric
              label="Active Withholding"
              value={toCurrency(sourceProfile.federalWithholding)}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Document Intake</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tax year {taxYear}: upload either or both source documents. If both
            exist, transcript values override original-return values for matched
            fields. Supported years in this build: {SUPPORTED_TAX_YEARS.join(", ")}
            .
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <UploadCard
              title="Original Tax Return"
              subtitle=".pdf, .txt, .csv"
              upload={originalFile}
              onChange={onSelectOriginal}
            />
            <UploadCard
              title="IRS Account Transcript"
              subtitle=".pdf, .txt, .csv"
              upload={transcriptFile}
              onChange={onSelectTranscript}
            />
          </div>

          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-950">
            {intakeStatus}
          </div>

          {adjustments.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Transcript Adjustments Applied
              </p>
              <div className="mt-2 space-y-1 text-sm text-amber-800">
                {adjustments.map((adjustment) => (
                  <p key={adjustment.id}>
                    <span className="font-medium">Line {adjustment.id}</span>{" "}
                    {adjustment.label}: {toCurrency(adjustment.from)} →{" "}
                    {toCurrency(adjustment.to)}
                  </p>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={applyMergedData}
            className="mt-5 rounded-lg bg-blue-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            Merge Intake Data and Start Optimization
          </button>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Merged return snapshot (Form 1040 lines — updates after Merge)
              </h3>
              <button
                type="button"
                onClick={recalculateMergedSnapshot}
                title="Recompute payments rollup, refund (Line 35) / balance due (Lines 37–37a), and AGI mirror from current amounts."
                className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Recalculate
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Page 1–2 lines are filled from each uploaded file (layout + phrase
              matching), then high-priority lines (e.g. 1a, 8–11a/11b, 24, 25d)
              override.
              <span className="font-medium text-slate-800">
                {" "}
                If a refund is due, edit Line 35 to match your Form 1040 line 35a.
                If you owe, Lines 37 / 37a show balance due (max(0, Line 24 −
                total payments)).
              </span>{" "}
              As-filed refund or balance due uses total payments (25d + 25e + 27
              + 32) minus Line 24 before what-if sliders.
            </p>
            <div
              className={`mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ring-1 ${
                asFiledRefundOrDue >= 0
                  ? "bg-emerald-50 ring-emerald-200"
                  : "bg-rose-50 ring-rose-200"
              }`}
            >
              <span className="text-slate-700">
                {asFiledRefundOrDue >= 0
                  ? "As-filed refund (see Line 35 vs Form 1040)"
                  : "As-filed balance due (see Line 37)"}
              </span>
              <span
                className={`font-semibold ${
                  asFiledRefundOrDue >= 0 ? "text-emerald-900" : "text-rose-900"
                }`}
              >
                {asFiledRefundOrDue >= 0
                  ? `Refund ${toCurrency(asFiledRefundOrDue)}`
                  : `Due ${toCurrency(Math.abs(asFiledRefundOrDue))}`}
              </span>
            </div>
            <p
              className={`mt-2 text-xs ${
                line37Reconciliation.match ? "text-emerald-800" : "text-amber-800"
              }`}
            >
              Balance due check (same as Line 37a): max(0, Line 24{" "}
              {toCurrency(line37Reconciliation.l24)} − total payments{" "}
              {toCurrency(line37Reconciliation.pay)}) ={" "}
              {toCurrency(line37Reconciliation.expected)}
              {line37Reconciliation.match
                ? " — matches Line 37 in the table."
                : " — differs from Line 37 (as read from the return); adjust Lines 24/25d or re-merge."}
            </p>

            <div className="mt-4 max-h-[min(70vh,520px)] overflow-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2">Line</th>
                    <th className="border-b border-slate-200 px-3 py-2">
                      Description
                    </th>
                    <th className="border-b border-slate-200 px-3 py-2 text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FORM_1040_LINE_ROWS.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 odd:bg-slate-50/80"
                    >
                      <td className="whitespace-nowrap px-3 py-1.5 font-mono text-xs font-medium text-slate-800">
                        {row.id}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-slate-700">
                        {row.label}
                      </td>
                      <td className="px-2 py-1">
                        {row.id === "8" ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            className="w-full rounded border border-slate-300 px-2 py-1 text-right text-sm text-slate-900"
                            title="Schedule 1 Line 8 — may be negative."
                            value={
                              line8Draft !== null
                                ? line8Draft
                                : Number.isNaN(sourceSnapshot["8"])
                                  ? ""
                                  : String(Math.round(sourceSnapshot["8"]))
                            }
                            onFocus={() => {
                              setLine8Draft(
                                Number.isNaN(sourceSnapshot["8"])
                                  ? ""
                                  : String(Math.round(sourceSnapshot["8"])),
                              );
                            }}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setLine8Draft(raw);
                              const n = tryParseSignedMoney(raw);
                              if (n !== undefined) {
                                setSourceSnapshot((prev) =>
                                  reconcileForm1040Snapshot({
                                    ...prev,
                                    "8": n,
                                  }),
                                );
                                setMergeGeneration((g) => g + 1);
                              }
                            }}
                            onBlur={() => {
                              const n = finalizeSignedMoney(line8Draft ?? "");
                              setLine8Draft(null);
                              setSourceSnapshot((prev) =>
                                reconcileForm1040Snapshot({
                                  ...prev,
                                  "8": n,
                                }),
                              );
                              setMergeGeneration((g) => g + 1);
                            }}
                            aria-label={`Line ${row.id} ${row.label}`}
                          />
                        ) : (
                          <input
                            type="number"
                            className={`w-full rounded border px-2 py-1 text-right text-sm ${
                              row.id === "37" ||
                              row.id === "37a" ||
                              (row.id === "35" && asFiledRefundOrDue < 0)
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-600"
                                : "border-slate-300 text-slate-900"
                            }`}
                            min={0}
                            disabled={
                              row.id === "37" ||
                              row.id === "37a" ||
                              (row.id === "35" && asFiledRefundOrDue < 0)
                            }
                            title={
                              row.id === "37"
                                ? "Amount owed from the return when parsed; matches Line 37a when payments tie out. Edit Lines 24 and withholding."
                                : row.id === "37a"
                                  ? "Computed: max(0, Line 24 − total payments)."
                                  : row.id === "35" && asFiledRefundOrDue < 0
                                    ? "No refund — balance due is on Line 37."
                                    : row.id === "35"
                                      ? "Refund to match Form 1040 line 35a when a refund is due."
                                      : undefined
                            }
                            value={
                              Number.isNaN(sourceSnapshot[row.id])
                                ? ""
                                : Math.round(sourceSnapshot[row.id])
                            }
                            onChange={(e) =>
                              setSnapshotLine(row.id, e.target.value)
                            }
                            aria-label={`Line ${row.id} ${row.label}`}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Quick keys for the what-if engine:{" "}
              {CORE_PROFILE_FIELDS.map((f) => f.label).join(" · ")}.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">What-If Inputs</h2>
            <p className="mt-1 text-sm text-slate-600">
              Adjust potential Schedule C and Schedule A values.
            </p>

            <div className="mt-6 space-y-6">
              <InputControl
                label="Business Expenses (Schedule C)"
                value={businessExpenses}
                min={0}
                max={180_000}
                step={100}
                onChange={setBusinessExpenses}
              />
              <InputControl
                label="Itemized Deductions (Schedule A)"
                value={itemizedDeductions}
                min={0}
                max={120_000}
                step={100}
                onChange={setItemizedDeductions}
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ToggleCard
                title="Zero Balance Goal"
                description="Auto-targets tax liability exactly equal to withholding."
                checked={zeroBalanceGoal}
                onCheckedChange={handleGoalToggle}
              />
              <ToggleCard
                title="Refund Maximizer"
                description={`Targets the 10% bracket for your filing status (${filingStatusLabel}).`}
                checked={refundMaximizer}
                onCheckedChange={handleRefundMaxToggle}
              />
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
              <p className="font-semibold">
                {taxYear} guidance ({filingStatusLabel})
              </p>
              <p className="mt-1">
                Zero balance target taxable income:{" "}
                <span className="font-semibold">
                  {toCurrency(zeroBalanceTargetTaxable)}
                </span>
              </p>
              <p className="mt-1">
                Exact business loss for zero balance:{" "}
                <span className="font-semibold">
                  {toCurrency(zeroBalanceReductionNeeded)}
                </span>
              </p>
              <p className="mt-1">
                Equivalent itemized deductions for zero balance:{" "}
                <span className="font-semibold">
                  {toCurrency(standardDeduction + zeroBalanceReductionNeeded)}
                </span>
              </p>
              <p className="mt-1">
                Reduction needed to reach 10% bracket:{" "}
                <span className="font-semibold">
                  {toCurrency(refundMaxReductionNeeded)}
                </span>
              </p>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <p className="mt-1 text-xs text-slate-500">
              What-if model uses {filingStatusLabel} brackets and standard deduction
              for {taxYear}. “As-filed refund / balance” from merged data is in the
              snapshot above.
            </p>
            <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Merged: total wages</span>
                <span className="font-medium">{toCurrency(sourceProfile.wages)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">As-filed refund / due</span>
                <span className="font-medium">
                  {asFiledRefundOrDue >= 0
                    ? toCurrency(asFiledRefundOrDue)
                    : `(${toCurrency(Math.abs(asFiledRefundOrDue))})`}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <ResultRow label="Corrected AGI" value={toCurrency(correctedAgi)} />
              <ResultRow
                label="Deduction Used"
                value={toCurrency(deductionUsed)}
                helper={`Standard ${taxYear} (${filingStatusLabel}): ${toCurrency(standardDeduction)}`}
              />
              <ResultRow
                label="Corrected Taxable Income"
                value={toCurrency(correctedTaxableIncome)}
              />
              <ResultRow
                label={`Tax liability (${taxYear}, ${filingStatusLabel})`}
                value={toCurrency(correctedTax)}
              />
              <ResultRow label="Tax Change vs Active" value={formatDelta(taxChange)} />
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <p>
                Active bracket:{" "}
                <span className="font-semibold">{originalBracket.label}</span>
              </p>
              <p className="mt-1">
                Corrected bracket:{" "}
                <span className="font-semibold">{currentBracket.label}</span>
              </p>
              <p className="mt-2 text-slate-600">
                Filing status for rate schedule: {filingStatusLabel} ({taxYear}).
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-sm text-white">
              {refundOrBalance >= 0 ? (
                <p>
                  Estimated refund:{" "}
                  <span className="text-lg font-semibold">
                    {toCurrency(refundOrBalance)}
                  </span>
                </p>
              ) : (
                <p>
                  Estimated amount still owed:{" "}
                  <span className="text-lg font-semibold">
                    {toCurrency(Math.abs(refundOrBalance))}
                  </span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={export1040x}
              className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
            >
              Export 1040-X Summary
            </button>
          </article>
        </section>

        {exportSummary && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Last Export Preview
            </h2>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-green-200">
              {exportSummary}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}

type UploadCardProps = {
  title: string;
  subtitle: string;
  upload: UploadState | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function UploadCard({ title, subtitle, upload, onChange }: UploadCardProps) {
  return (
    <label className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-slate-600">{subtitle}</p>
      <input
        type="file"
        accept=".pdf,.txt,.csv"
        className="mt-3 block w-full text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-700 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
        onChange={onChange}
      />
      <p className="mt-2 text-xs text-slate-600">
        {upload ? `${upload.fileName} - ${upload.message}` : "No file uploaded yet."}
      </p>
    </label>
  );
}

type InputControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
};

function InputControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: InputControlProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-800">{label}</label>
        <span className="text-sm font-semibold text-slate-900">
          {toCurrency(value)}
        </span>
      </div>
      <input
        type="range"
        className="w-full accent-blue-700"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parsePositiveNumber(event.target.value))}
      />
      <input
        type="number"
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        min={min}
        max={max}
        step={step}
        value={toDisplayNumber(value)}
        onChange={(event) => onChange(parsePositiveNumber(event.target.value))}
      />
    </div>
  );
}

type ToggleCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function ToggleCard({
  title,
  description,
  checked,
  onCheckedChange,
}: ToggleCardProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-blue-700"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span>
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-xs text-slate-600">{description}</span>
      </span>
    </label>
  );
}

type ResultRowProps = {
  label: string;
  value: string;
  helper?: string;
};

function ResultRow({ label, value, helper }: ResultRowProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-blue-100">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

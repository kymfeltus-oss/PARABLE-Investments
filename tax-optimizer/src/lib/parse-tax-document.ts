import type { Form1040LineId, Form1040Snapshot } from "@/lib/form-1040-snapshot";
import {
  implyTotalPaymentsFromParsedLine37,
  parsedSnapshotToUploadPartial,
  partialToFullSnapshot,
  reconcileForm1040Snapshot,
  repairIncomeDeductionBlockPartial,
  repairTaxSectionPartial,
} from "@/lib/form-1040-snapshot";
import {
  extractPage12LineItems,
  mergePage12WithSpecialized,
} from "@/lib/parse-1040-pages12";

/** Normalize PDF text so labels and amounts are easier to match. */
function normalizeDocText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[\t ]+/g, " ").trim();
}

/** Parse a money token (handles commas; ignores $). */
function parseMoneyToken(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

function parseNumberCapture(value: string): number {
  const cleaned = value.replace(/[$,\s]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

function collectNumbersNearKeyword(
  text: string,
  keywordLower: string,
  windowChars: number,
): number[] {
  const t = text.toLowerCase();
  const found: number[] = [];
  let from = 0;
  while (from < t.length) {
    const i = t.indexOf(keywordLower, from);
    if (i === -1) {
      break;
    }
    const chunk = text.slice(i, i + windowChars);
    for (const match of chunk.matchAll(
      /(\d{1,3}(?:,\d{3})+|\d{4,}|\d{2,3}\.\d{2})/g,
    )) {
      const v = parseMoneyToken(match[1]);
      if (v >= 1) {
        found.push(v);
      }
    }
    from = i + keywordLower.length;
  }
  return found;
}

function pickBestAmount(candidates: number[]): number | undefined {
  if (candidates.length === 0) {
    return undefined;
  }
  const nonYear = candidates.filter((c) => c < 1900 || c > 2100);
  const pool = nonYear.length > 0 ? nonYear : candidates;
  const significant = pool.filter((c) => c >= 100);
  const use = significant.length > 0 ? significant : pool;
  return Math.max(...use);
}

function bestFromKeywordGroups(
  text: string,
  keywords: string[],
): number | undefined {
  const all: number[] = [];
  for (const kw of keywords) {
    all.push(...collectNumbersNearKeyword(text, kw.toLowerCase(), 220));
  }
  return pickBestAmount(all);
}

function extractField(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const v = parseNumberCapture(match[1]);
      if (v >= 1) {
        return v;
      }
    }
  }
  return undefined;
}

const ANY_AMT = "(\\d{1,3}(?:,\\d{3})*|\\d{1,7})(?:\\.\\d{2})?";

function extractW2Box1Line1aFromRows(text: string): number | undefined {
  const lines = text.split(/\n/).map((L) => L.trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    const hasW2 = lower.includes("w-2") || lower.includes("w2");
    const hasBox1 =
      /box\s*1\b/.test(lower) ||
      (lower.includes("box") && /\b1\b/.test(lower) && hasW2);
    if (!hasW2 || !hasBox1) {
      continue;
    }
    const matches = [
      ...line.matchAll(/(\d{1,3}(?:,\d{3})+|\d{1,7})(?:\.\d{2})?\b/g),
    ];
    if (matches.length === 0) {
      continue;
    }
    const last = matches[matches.length - 1][1];
    const v = parseMoneyToken(last);
    if (v < 1e8 && !isLikelyTaxYear(v)) {
      return v;
    }
  }
  for (const line of lines) {
    if (!/\b1\s*a\b/i.test(line) && !/line\s*1\s*a/i.test(line)) {
      continue;
    }
    if (!/total\s+amount|w-?2|box/i.test(line)) {
      continue;
    }
    const matches = [
      ...line.matchAll(/(\d{1,3}(?:,\d{3})+|\d{1,7})(?:\.\d{2})?\b/g),
    ];
    if (matches.length === 0) {
      continue;
    }
    const last = matches[matches.length - 1][1];
    const v = parseMoneyToken(last);
    if (v < 1e8 && !isLikelyTaxYear(v)) {
      return v;
    }
  }
  return undefined;
}

function extractForm1040Line1aWages(raw: string): number | undefined {
  const layoutPart = raw.includes("---FLAT---")
    ? raw.split("---FLAT---")[0]
    : raw;
  const tLayout = normalizeDocText(layoutPart);
  const tFull = normalizeDocText(raw);

  const fromRows = extractW2Box1Line1aFromRows(tLayout);
  if (fromRows !== undefined) {
    return fromRows;
  }

  const direct: RegExp[] = [
    new RegExp(
      `1\\s*a\\s+total\\s+amount\\s+from\\s+form[^\\d]{0,200}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(
      `total\\s+amount\\s+from\\s+form(?:\\(s\\))?\\s+w[-\\s]?2[^\\d]{0,120}?(?:box\\s*1)?[^\\d]{0,60}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(
      `form(?:\\(s\\))?\\s+w[-\\s]?2[^\\d]{0,40}?box\\s*1[^\\d]{0,80}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(`(?:^|\\s)1\\s*a\\s+${ANY_AMT}`, "i"),
    new RegExp(`line\\s*1\\s*a[^\\d]{0,100}?${ANY_AMT}`, "i"),
    new RegExp(`\\b1\\s*a\\s*[.:$\\s-]*${ANY_AMT}`, "i"),
  ];
  for (const t of [tLayout, tFull]) {
    for (const re of direct) {
      const m = t.match(re);
      if (m?.[1]) {
        const v = parseMoneyToken(m[1]);
        if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
          return v;
        }
      }
    }
    const idx = t.search(/\b1\s*a\b/i);
    if (idx >= 0) {
      const slice = t.slice(idx, idx + 160);
      const m = slice.match(/(\d{1,3}(?:,\d{3})*|\d{1,7})(?:\.\d{2})?/);
      if (m?.[1]) {
        const v = parseMoneyToken(m[1]);
        if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
          return v;
        }
      }
    }
  }
  return undefined;
}

function isLikelyTaxYear(n: number): boolean {
  return n >= 1900 && n <= 2100;
}

/** Text before ---FLAT--- is row-reconstructed; prefer it for line 8–11. */
function layoutLinesFromRaw(raw: string): string[] {
  const part = raw.includes("---FLAT---")
    ? raw.split("---FLAT---")[0]
    : raw;
  return normalizeDocText(part)
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function lastMoneyOnLine(line: string): number | undefined {
  const matches = [
    ...line.matchAll(/(\d{1,3}(?:,\d{3})+|\d{1,7})(?:\.\d{2})?\b/g),
  ];
  if (matches.length === 0) {
    return undefined;
  }
  const last = matches[matches.length - 1][1];
  const v = parseMoneyToken(last);
  if (v >= 1e8 || isLikelyTaxYear(v)) {
    return undefined;
  }
  return v;
}

/**
 * Line 8 — Additional income from Schedule 1 (not "line 18" or other schedules).
 */
function extractLine8FromRows(lines: string[]): number | undefined {
  for (const line of lines) {
    const lo = line.toLowerCase();
    if (!/additional\s+income/.test(lo) || !/schedule\s*1/.test(lo)) {
      continue;
    }
    if (!/(^|[^\d])8([\s.)]|$)/.test(line) && !/line\s*8\b/i.test(line)) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined) {
      return v;
    }
  }
  return undefined;
}

/**
 * Line 9 — Total income ("This is your total income" on Form 1040).
 */
function extractLine9FromRows(lines: string[]): number | undefined {
  for (const line of lines) {
    const lo = line.toLowerCase();
    if (/taxable\s+income/.test(lo)) {
      continue;
    }
    if (
      /total\s+income\s+tax/i.test(lo) ||
      /income\s+tax\s+withheld/i.test(lo)
    ) {
      continue;
    }
    const isTotalIncomeRow =
      /this\s+is\s+your\s+total\s+income/.test(lo) ||
      (/add\s+lines?\s+1z/i.test(lo) && /total\s+income/i.test(lo)) ||
      (/total\s+income/i.test(lo) &&
        (/line\s*9\b|^\s*9[\s.)]|(^|\s)9[\s.)]/.test(line) ||
          /add\s+lines?\s+1z/.test(lo)));
    if (!isTotalIncomeRow) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined) {
      return v;
    }
  }
  return undefined;
}

/**
 * Line 10 — Adjustments to income from Schedule 1.
 */
function extractLine10FromRows(lines: string[]): number | undefined {
  for (const line of lines) {
    const lo = line.toLowerCase();
    if (!/adjustments?\s+to\s+income/.test(lo)) {
      continue;
    }
    if (!/schedule\s*1/.test(lo)) {
      continue;
    }
    if (!/(^|[^\d])10([\s.)]|$)/.test(line) && !/line\s*10\b/i.test(line)) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined) {
      return v;
    }
  }
  return undefined;
}

/** Line 12e — standard or itemized deduction (avoid Schedule 8812 line noise). */
function extractLine12eFromRows(lines: string[]): number | undefined {
  for (const line of lines) {
    const lo = line.toLowerCase();
    if (/\b8812\b/.test(lo) && !/line\s*12\s*e|standard\s+deduction\s+or\s+itemized/i.test(lo)) {
      continue;
    }
    if (
      !/line\s*12\s*e\b|^\s*12\s*e[\s.)]|standard\s+deduction\s+or\s+itemized|itemized\s+deductions/i.test(
        lo,
      )
    ) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined && v !== 8812 && v !== 8814) {
      return v;
    }
  }
  return undefined;
}

/** Line 13a — QBI (Form 8995). */
function extractLine13aFromRows(lines: string[]): number | undefined {
  for (const line of lines) {
    const lo = line.toLowerCase();
    if (
      !/qualified\s+business\s+income|line\s*13\s*a\b|^\s*13\s*a[\s.)]|form\s*8995/i.test(
        lo,
      )
    ) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined) {
      return v;
    }
  }
  return undefined;
}

/**
 * Line 11 — AGI ("This is your adjusted gross income").
 */
function extractLine11FromRows(lines: string[]): number | undefined {
  for (const line of lines) {
    const lo = line.toLowerCase();
    if (/taxable\s+income/.test(lo)) {
      continue;
    }
    const isAgiRow =
      /this\s+is\s+your\s+adjusted\s+gross\s+income/.test(lo) ||
      /line\s*11\s*a\b|^\s*11\s*a[\s.)]/i.test(line) ||
      /line\s*11\s*b\b|^\s*11\s*b[\s.)]/i.test(line) ||
      (/adjusted\s+gross\s+income/.test(lo) &&
        (/(^|[^\d])11([\s.)]|$)/.test(line) ||
          /line\s*11\b/i.test(line) ||
          /subtract\s+line\s*10\s+from\s+line\s*9/.test(lo)));
    if (!isAgiRow) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined) {
      return v;
    }
  }
  return undefined;
}

function extractForm1040Line11Agi(t: string): number | undefined {
  const patterns = [
    new RegExp(
      `subtract\\s+line\\s*10\\s+from\\s+line\\s*9[^\\d]{0,120}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(
      `this\\s+is\\s+your\\s+adjusted\\s+gross\\s+income[^\\d]{0,100}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(
      `adjusted\\s+gross\\s+income[^\\d]{0,40}?${ANY_AMT}`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
        return v;
      }
    }
  }
  return undefined;
}

function extractForm1040Line15Taxable(t: string): number | undefined {
  const patterns = [
    new RegExp(
      `subtract\\s+line\\s*14\\s+from\\s+line\\s*11\\s*b[^\\d]{0,120}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(
      `subtract\\s+line\\s*14\\s+from\\s+line\\s*11[^\\d]{0,120}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(`line\\s*15[^\\d]{0,80}?${ANY_AMT}`, "i"),
    new RegExp(`taxable\\s+income[^\\d]{0,80}?${ANY_AMT}`, "i"),
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
        return v;
      }
    }
  }
  return undefined;
}

/** Dollar amounts only — avoids treating the line label "24" as $24. */
const LINE24_MONEY =
  "(\\d{1,3}(?:,\\d{3})+|\\d{3,7})(?:\\.\\d{2})?";

function isLine24AmountEchoFalsePositive(
  capture: string,
  parsed: number,
): boolean {
  const core = capture.replace(/[$,\s]/g, "").replace(/\.\d{2}$/, "");
  if (parsed > 0 && parsed < 100 && core.length <= 2) {
    return true;
  }
  return false;
}

/**
 * Line 24 — total tax (add lines 22 and 23). Not Line 16 tax, not the "24" line label.
 */
function extractForm1040Line24Tax(t: string): number | undefined {
  const candidates: number[] = [];

  const phrases = [
    new RegExp(`add\\s+lines\\s*22\\s+and\\s*23\\D{0,240}?${LINE24_MONEY}\\b`, "gi"),
    new RegExp(
      `this\\s+is\\s+your\\s+total\\s+tax\\D{0,160}?${LINE24_MONEY}\\b`,
      "gi",
    ),
    new RegExp(
      `total\\s+tax\\s*\\.?\\s*\\(?line\\s*24\\)?\\D{0,120}?${LINE24_MONEY}\\b`,
      "gi",
    ),
  ];
  for (const re of phrases) {
    for (const m of t.matchAll(re)) {
      if (!m[1]) {
        continue;
      }
      const v = parseMoneyToken(m[1]);
      if (
        v >= 0 &&
        v < 100_000_000 &&
        !isLikelyTaxYear(v) &&
        !isLine24AmountEchoFalsePositive(m[1], v)
      ) {
        candidates.push(v);
      }
    }
  }

  const line24Label = new RegExp(
    `line\\s*24\\b\\D{0,200}?${LINE24_MONEY}\\b`,
    "gi",
  );
  for (const m of t.matchAll(line24Label)) {
    if (!m[1]) {
      continue;
    }
    const v = parseMoneyToken(m[1]);
    if (
      v >= 0 &&
      v < 100_000_000 &&
      !isLikelyTaxYear(v) &&
      !isLine24AmountEchoFalsePositive(m[1], v)
    ) {
      candidates.push(v);
    }
  }

  if (candidates.length > 0) {
    return Math.max(...candidates);
  }

  const loose = [
    new RegExp(`add\\s+lines\\s*22\\s+and\\s*23[^\\d]{0,120}?${ANY_AMT}`, "i"),
    new RegExp(`this\\s+is\\s+your\\s+total\\s+tax[^\\d]{0,100}?${ANY_AMT}`, "i"),
  ];
  for (const re of loose) {
    const m = t.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (
        v >= 0 &&
        v < 100_000_000 &&
        !isLikelyTaxYear(v) &&
        !isLine24AmountEchoFalsePositive(m[1], v)
      ) {
        return v;
      }
    }
  }

  // Last resort: substantial amounts near the Line 24 instructions (PDF order varies;
  // phrases may be split — regex misses, but keyword windows often still work).
  const nearPhrases = ["add lines 22 and 23", "this is your total tax"];
  const bucket: number[] = [];
  for (const kw of nearPhrases) {
    bucket.push(...collectNumbersNearKeyword(t, kw, 420));
  }
  const good = bucket.filter(
    (n) => n >= 100 && n < 100_000_000 && !isLikelyTaxYear(n),
  );
  if (good.length > 0) {
    return Math.max(...good);
  }
  return undefined;
}

function extractForm1040Line25Withholding(t: string): number | undefined {
  const patterns = [
    new RegExp(
      `federal\\s+income\\s+tax\\s+withheld\\s+from:\\s*form(?:\\(s\\))?\\s+w[-\\s]?2[^\\d]{0,80}?${ANY_AMT}`,
      "i",
    ),
    new RegExp(`line\\s*25\\s*d[^\\d]{0,80}?${ANY_AMT}`, "i"),
    new RegExp(`25\\s*d\\s+${ANY_AMT}`, "i"),
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
        return v;
      }
    }
  }
  return undefined;
}

function extractForm1040Line25aW2Withheld(t: string): number | undefined {
  const patterns = [
    new RegExp(`line\\s*25\\s*a[^\\d]{0,100}?${ANY_AMT}`, "i"),
    new RegExp(
      `federal\\s+income\\s+tax\\s+withheld\\s+from[^\\d]{0,40}?form(?:\\(s\\))?\\s+w[-\\s]?2[^\\d]{0,80}?${ANY_AMT}`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
        return v;
      }
    }
  }
  return undefined;
}

function clampWagesToAgi(
  wages: number | undefined,
  agi: number | undefined,
): number | undefined {
  if (wages === undefined) {
    return undefined;
  }
  if (agi === undefined || agi <= 0) {
    return wages;
  }
  if (wages > agi * 15) {
    return undefined;
  }
  return wages;
}

function setIfDefined(
  out: Partial<Form1040Snapshot>,
  id: Form1040LineId,
  v: number | undefined,
): void {
  if (v !== undefined && Number.isFinite(v)) {
    out[id] = Math.max(0, v);
  }
}

const SCHEDULE_1_SUB_LINES = [
  "1b",
  "1c",
  "1d",
  "1e",
  "1f",
  "1g",
  "1h",
  "1i",
] as const;

/**
 * Printed Line 1z — "Add lines 1a through 1h" (or 1i on some forms). Prefer over summing OCR junk on 1b–1i.
 */
function extractForm1040Line1zSubtotal(
  layoutLines: string[],
  normalizedText: string,
): number | undefined {
  for (const line of layoutLines) {
    const lo = line.toLowerCase();
    if (
      !/add\s+lines?\s*1a\s+through\s+1[hi]\b|line\s*1\s*z\b|^\s*1\s*z[\s.)]/i.test(
        lo,
      )
    ) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined && v > 0) {
      return v;
    }
  }
  const block = [
    /add\s+lines?\s*1a\s+through\s+1h\D{0,200}?(\d{1,3}(?:,\d{3})+|\d{2,7})\b/i,
    /add\s+lines?\s*1a\s+through\s+1i\D{0,200}?(\d{1,3}(?:,\d{3})+|\d{2,7})\b/i,
  ];
  for (const re of block) {
    const m = normalizedText.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (v > 0 && v < 1e8 && !isLikelyTaxYear(v)) {
        return v;
      }
    }
  }
  return undefined;
}

function sumSchedule1SubLines(out: Partial<Form1040Snapshot>): number {
  let s = 0;
  for (const id of SCHEDULE_1_SUB_LINES) {
    s += Math.max(0, out[id] ?? 0);
  }
  return s;
}

/**
 * Line 37 — amount owed (not Line 37a estimated penalty / Line 38).
 */
function extractForm1040Line37AmountOwed(
  layoutLines: string[],
  normalizedText: string,
): number | undefined {
  for (const line of layoutLines) {
    const lo = line.toLowerCase();
    if (
      !/amount\s+you\s+owe|balance\s+due|line\s*37\b(?!\s*[ab])|subtract\s+line\s*33\s+from\s+line\s*24/i.test(
        lo,
      )
    ) {
      continue;
    }
    if (/estimated\s+tax\s+penalty|2210|line\s*38|line\s*37\s*b/i.test(lo)) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v !== undefined && v > 0) {
      return v;
    }
  }
  // \D (not digit) so "Amount you owe. $9,609" works; [^.\d] failed on a period after "owe".
  const block = [
    /amount\s+you\s+owe\D{0,200}?(\d{1,3}(?:,\d{3})+|\d{2,7})\b/i,
    /balance\s+due\D{0,160}?(\d{1,3}(?:,\d{3})+|\d{2,7})\b/i,
    /subtract\s+line\s*33\s+from\s+line\s*24\D{0,200}?(\d{1,3}(?:,\d{3})+|\d{2,7})\b/i,
  ];
  for (const re of block) {
    const m = normalizedText.match(re);
    if (m?.[1]) {
      const v = parseMoneyToken(m[1]);
      if (v > 0 && v < 1e8 && !isLikelyTaxYear(v)) {
        return v;
      }
    }
  }
  // Last resort: "Line 37" / row "37" followed by the dollars-only column (Form 1040 layout).
  const line37Amt = /\bline\s*37\b(?!\s*[ab])\D{0,140}?(\d{1,3}(?:,\d{3})+|\d{4,7})\b/gi;
  let best: number | undefined;
  for (const m of normalizedText.matchAll(line37Amt)) {
    const v = parseMoneyToken(m[1]!);
    if (v > 0 && v < 1e8 && !isLikelyTaxYear(v)) {
      best = v;
    }
  }
  return best;
}

/**
 * Page-12 scan often mis-assigns Line 16 → Line 24 or echoes "24" as $24.
 * Re-run Line 24 extraction after merge and fix obvious OCR garbage on Schedule 1 sub-lines.
 */
function repairParsedSnapshotAfterMerge(
  out: Partial<Form1040Snapshot>,
  normalizedText: string,
  layoutLines: string[],
): void {
  const again = extractForm1040Line24Tax(normalizedText);
  const cur = out["24"];
  const bad =
    cur === undefined ||
    cur === 0 ||
    (cur > 0 && cur < 100) ||
    cur === 24;
  if (again !== undefined) {
    if (bad) {
      out["24"] = again;
    } else if (
      cur !== undefined &&
      again > cur * 1.35 &&
      again >= 500
    ) {
      out["24"] = again;
    }
  }

  /** Lines 1b–1i: OCR often fills spurious small numbers; Line 1z on the form is authoritative. */
  const oneA = Math.max(0, out["1a"] ?? 0);
  const zFromForm = extractForm1040Line1zSubtotal(layoutLines, normalizedText);
  const subSum = sumSchedule1SubLines(out);
  const zTab = out["1z"];

  if (oneA > 0 && zFromForm !== undefined && Math.abs(zFromForm - oneA) <= 2) {
    for (const id of SCHEDULE_1_SUB_LINES) {
      out[id] = 0;
    }
    out["1z"] = zFromForm;
  } else if (
    oneA >= 100 &&
    oneA <= 500_000 &&
    subSum > 0 &&
    subSum < 250 &&
    zTab !== undefined &&
    Math.abs(zTab - oneA - subSum) <= 3
  ) {
    const maxSub = Math.max(
      ...SCHEDULE_1_SUB_LINES.map((id) => Math.max(0, out[id] ?? 0)),
    );
    const junkPattern =
      subSum < oneA * 0.4 &&
      maxSub <= 50 &&
      (SCHEDULE_1_SUB_LINES.filter((id) => {
        const v = out[id];
        return v !== undefined && v > 0 && v <= 9;
      }).length >= 3 ||
        maxSub <= 35);
    if (junkPattern) {
      for (const id of SCHEDULE_1_SUB_LINES) {
        out[id] = 0;
      }
      out["1z"] = oneA;
    }
  } else {
    const vals = SCHEDULE_1_SUB_LINES.map((id) => out[id]).filter(
      (v): v is number => v !== undefined && Number.isFinite(v),
    );
    if (vals.length >= 4) {
      const u = new Set(vals);
      if (u.size === 1 && [...u][0]! <= 9 && oneA > 100) {
        for (const id of SCHEDULE_1_SUB_LINES) {
          out[id] = 0;
        }
      }
    }
  }

  if (out["1a"] !== undefined) {
    let sum = Math.max(0, out["1a"] ?? 0);
    for (const id of SCHEDULE_1_SUB_LINES) {
      sum += Math.max(0, out[id] ?? 0);
    }
    const z = out["1z"];
    if (z === undefined || Math.abs(z - sum) > 15) {
      out["1z"] = sum;
    }
  }
}

/**
 * Form 1040: Line 11 = Line 9 − Line 10. Fix a bad Line 9 OCR when 11 (+10) is reliable.
 */
function reconcileIncomeLines(out: Partial<Form1040Snapshot>): void {
  const n11 = [out["11b"], out["11a"]].find(
    (v) => v !== undefined && Number.isFinite(v),
  );
  if (n11 === undefined || !Number.isFinite(n11)) {
    return;
  }
  const t10 = out["10"];
  const adj =
    t10 !== undefined && Number.isFinite(t10) ? Math.max(0, t10) : 0;
  const expected9 = n11 + adj;
  const n9 = out["9"];

  if (n9 === undefined || !Number.isFinite(n9)) {
    out["9"] = expected9;
  } else {
    const tol = Math.max(5, Math.round(expected9 * 0.008));
    if (Math.abs(n9 - expected9) > tol) {
      out["9"] = expected9;
    }
  }

  if (
    out["10"] === undefined &&
    out["9"] !== undefined &&
    n11 !== undefined
  ) {
    out["10"] = Math.max(0, out["9"]! - n11);
  }
}

/**
 * Best-effort extraction of Form 1040 line amounts from transcript or return text.
 * Unmatched lines are omitted (caller merges with baseline / manual entry).
 */
export function parseTaxDataFromText(rawText: string): Partial<Form1040Snapshot> {
  const text = normalizeDocText(rawText);
  const layoutLines = layoutLinesFromRaw(rawText);

  const agiKeywords = [
    "adjusted gross income",
    "adjusted gross income per return",
  ];
  const taxableKeywords = ["taxable income", "taxable income per return"];
  const wageKeywords = [
    "wages, salaries, tips",
    "wages salaries tips",
    "wages per return",
    "verified wages",
    "form(s) w-2",
    "form w-2",
    "total amount from form(s) w-2",
  ];
  const withholdingKeywords = [
    "federal income tax withheld",
    "federal tax withheld",
    "income tax withheld",
    "federal withholding",
  ];

  const agiFromRows = extractLine11FromRows(layoutLines);
  const agiFromForm = extractForm1040Line11Agi(text);
  const agi =
    agiFromRows ??
    agiFromForm ??
    bestFromKeywordGroups(text, agiKeywords) ??
    extractField(text, [
      /\bagi\b[^$\d]{0,40}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
      /adjusted\s+gross\s+income[^$\d]{0,60}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
    ]);

  const taxableIncome =
    extractForm1040Line15Taxable(text) ??
    bestFromKeywordGroups(text, taxableKeywords) ??
    extractField(text, [
      /taxable\s+income[^$\d]{0,60}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
    ]);

  // Do not use bestFromKeywordGroups("total tax") for Line 24 — it often grabs
  // Line 16 or other amounts. Line 24 must come from explicit total-tax phrases.
  const taxAssessed =
    extractForm1040Line24Tax(text) ??
    extractField(text, [
      /this\s+is\s+your\s+total\s+tax[^$\d]{0,80}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
      /add\s+lines\s*22\s+and\s*23[^$\d]{0,120}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
    ]);

  let wages =
    extractForm1040Line1aWages(rawText) ??
    extractField(text, [
      /verified\s+wages[^$\d]{0,60}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
      new RegExp(`line\\s*1a[^\\d]{0,40}?${ANY_AMT}`, "i"),
    ]);

  if (wages === undefined) {
    wages = clampWagesToAgi(bestFromKeywordGroups(text, wageKeywords), agi);
  }

  const federalWithholding =
    extractForm1040Line25Withholding(text) ??
    bestFromKeywordGroups(text, withholdingKeywords) ??
    extractField(text, [
      /federal\s+income\s+tax\s+withheld[^$\d]{0,80}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
      /line\s*25d[^$\d]{0,40}?\$?\s*(\d{1,3}(?:,\d{3})+|\d{4,})/i,
    ]);

  const v25a = extractForm1040Line25aW2Withheld(text);

  const spec: Partial<Form1040Snapshot> = {};
  setIfDefined(spec, "1a", wages);
  setIfDefined(spec, "11a", agi);
  setIfDefined(spec, "11b", agi);
  setIfDefined(spec, "15", taxableIncome);
  setIfDefined(spec, "24", taxAssessed);
  setIfDefined(spec, "25d", federalWithholding);
  setIfDefined(spec, "25a", v25a);
  setIfDefined(spec, "8", extractLine8FromRows(layoutLines));
  setIfDefined(spec, "9", extractLine9FromRows(layoutLines));
  setIfDefined(spec, "10", extractLine10FromRows(layoutLines));
  setIfDefined(spec, "12e", extractLine12eFromRows(layoutLines));
  setIfDefined(spec, "13a", extractLine13aFromRows(layoutLines));
  setIfDefined(spec, "37", extractForm1040Line37AmountOwed(layoutLines, text));

  const page12Partial = extractPage12LineItems(layoutLines, rawText);
  const mergedPartial = mergePage12WithSpecialized(page12Partial, spec);
  repairParsedSnapshotAfterMerge(mergedPartial, text, layoutLines);
  repairIncomeDeductionBlockPartial(mergedPartial);
  repairTaxSectionPartial(mergedPartial);
  reconcileIncomeLines(mergedPartial);
  implyTotalPaymentsFromParsedLine37(mergedPartial);

  const full = reconcileForm1040Snapshot(partialToFullSnapshot(mergedPartial));
  return parsedSnapshotToUploadPartial(full);
}

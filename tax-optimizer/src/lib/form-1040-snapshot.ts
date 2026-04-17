/**
 * Form 1040 line-item model for merged return snapshot (amounts only).
 * Labels follow IRS Form 1040 (2023–2024 style); minor year-to-year wording varies.
 */

export const FORM_1040_LINE_ROWS = [
  { id: "1a", label: "Wages, salaries, tips, etc. (Form(s) W-2, box 1)" },
  { id: "1b", label: "Household employee wages not reported on W-2" },
  { id: "1c", label: "Tip income not reported on line 1a" },
  { id: "1d", label: "Medicaid waiver payments not reported on W-2" },
  { id: "1e", label: "Taxable dependent care benefits from Form 2441" },
  { id: "1f", label: "Employer-provided adoption benefits from Form 8839" },
  { id: "1g", label: "Wages from Form 8919" },
  { id: "1h", label: "Other earned income" },
  { id: "1i", label: "Nontaxable combat pay election" },
  { id: "1z", label: "Add lines 1a through 1i" },
  { id: "2a", label: "Tax-exempt interest" },
  { id: "2b", label: "Taxable interest" },
  { id: "3a", label: "Qualified dividends" },
  { id: "3b", label: "Ordinary dividends" },
  { id: "4a", label: "IRA distributions" },
  { id: "4b", label: "Taxable amount of IRA distributions" },
  { id: "5a", label: "Pensions and annuities" },
  { id: "5b", label: "Taxable amount of pensions and annuities" },
  { id: "6a", label: "Social Security benefits" },
  { id: "6b", label: "Taxable amount of Social Security benefits" },
  { id: "7a", label: "Capital gain or (loss) — Schedule D / Form 4797 (Line 7)" },
  {
    id: "7b",
    label:
      "If not required to file Schedule D, other gains (Form 1040 Line 7 checkbox area)",
  },
  {
    id: "8",
    label:
      "Additional income from Schedule 1 (may be negative per Schedule 1)",
  },
  {
    id: "9",
    label:
      "Total income (add lines 1z, 2b, 3b, 4b, 5b, 6b, 7a, 7b, and 8)",
  },
  { id: "10", label: "Adjustments to income from Schedule 1" },
  {
    id: "11a",
    label:
      "Subtract line 10 from line 9 — adjusted gross income (2024+ Form 1040 page 1)",
  },
  {
    id: "11b",
    label:
      "Amount from line 11a — adjusted gross income (2024+ Form 1040 page 2)",
  },
  {
    id: "12e",
    label:
      "Standard deduction or itemized deductions (Form 1040 line 12e; Schedule A if itemized)",
  },
  {
    id: "13a",
    label: "Qualified business income deduction — Form 8995 / 8995-A (line 13a)",
  },
  {
    id: "13b",
    label: "Additional deductions from Schedule 1-A, line 38 (line 13b)",
  },
  {
    id: "14",
    label: "Add lines 12e, 13a, and 13b (2024+ Form 1040 line 14)",
  },
  {
    id: "15",
    label: "Taxable income (subtract line 14 from line 11b on 2024+ forms)",
  },
  { id: "17", label: "Amount from Schedule 2, line 3" },
  {
    id: "18",
    label: "Add lines 16 and 17 (2024+ Form 1040 line 18 — tax before credits)",
  },
  {
    id: "19",
    label: "Nonrefundable child tax credit / credit for other dependents (line 19)",
  },
  { id: "20", label: "Amount from Schedule 3, line 8 (line 20)" },
  {
    id: "21",
    label: "Add lines 19 and 20 — total nonrefundable credits (2024+ line 21)",
  },
  {
    id: "22",
    label: "Subtract line 21 from line 18 — net tax before other taxes (2024+ line 22)",
  },
  {
    id: "23",
    label: "Other taxes, including self-employment tax (Schedule 2, line 21; 2024+ line 23)",
  },
  { id: "24", label: "Add lines 22 and 23 — total tax (2024+ line 24)" },
  { id: "25a", label: "Federal income tax withheld from Form(s) W-2" },
  { id: "25b", label: "Federal income tax withheld from Form(s) 1099" },
  { id: "25c", label: "Federal income tax withheld from other forms" },
  { id: "25d", label: "Total federal income tax withheld (add 25a through 25c)" },
  { id: "25e", label: "Other payments and refundable credits (Schedule 3)" },
  { id: "27", label: "Earned income credit (EIC)" },
  { id: "32", label: "Total other payments and refundable credits" },
  {
    id: "34",
    label: "Overpayment (total payments minus Line 24; refund if positive)",
  },
  {
    id: "35",
    label:
      "Refund to you (Form 1040 line 35a — tie to uploaded return when refund due)",
  },
  { id: "35b", label: "Routing number (nine digits)" },
  { id: "35c", label: "Type: checking or savings (use 1 or 2 if numeric)" },
  { id: "35d", label: "Account number (numeric)" },
  { id: "36", label: "Amount of line 34 you want applied to your estimated tax" },
  {
    id: "37",
    label:
      "Amount you owe (Line 37 — from the return when parsed; balance due when tax exceeds payments)",
  },
  {
    id: "37a",
    label:
      "Amount you owe — computed check (max(0, Line 24 − total payments))",
  },
  {
    id: "37b",
    label: "Estimated tax penalty (Form 2210; IRS Line 38 on paper Form 1040)",
  },
] as const;

export type Form1040LineId = (typeof FORM_1040_LINE_ROWS)[number]["id"];

export type Form1040Snapshot = Record<Form1040LineId, number>;

/** Form 1040 page 1–2 line numbers (through refund / amount owed). */
export const FORM_1040_FIRST_TWO_PAGES_LINE_IDS: readonly Form1040LineId[] = [
  "1a",
  "1b",
  "1c",
  "1d",
  "1e",
  "1f",
  "1g",
  "1h",
  "1i",
  "1z",
  "2a",
  "2b",
  "3a",
  "3b",
  "4a",
  "4b",
  "5a",
  "5b",
  "6a",
  "6b",
  "7a",
  "7b",
  "8",
  "9",
  "10",
  "11a",
  "11b",
  "12e",
  "13a",
  "13b",
  "14",
  "15",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25a",
  "25b",
  "25c",
  "25d",
  "25e",
  "27",
  "32",
  "34",
  "35",
  "35b",
  "35c",
  "35d",
  "36",
  "37",
  "37a",
  "37b",
] as const;

/**
 * Total payments and refundable credits for tie-out (25d + 25e + 27 + 32).
 * Line 33 is not stored; this rollup replaces it.
 */
export function rollupTotalPayments(s: Form1040Snapshot): number {
  return (
    Math.max(0, s["25d"]) +
    Math.max(0, s["25e"]) +
    Math.max(0, s["27"]) +
    Math.max(0, s["32"])
  );
}

/** @deprecated Use {@link rollupTotalPayments} */
export function rollupTotalPaymentsLine33(s: Form1040Snapshot): number {
  return rollupTotalPayments(s);
}

/** Line 37 = max(0, Line 24 − total payments). */
export function reconciledAmountOwedLine37(s: Form1040Snapshot): number {
  const pay = rollupTotalPayments(s);
  return Math.max(0, Math.round(s["24"] - pay));
}

/** Overpayment (Line 34) = max(0, total payments − Line 24). */
export function reconciledOverpaymentLine34(s: Form1040Snapshot): number {
  const pay = rollupTotalPayments(s);
  return Math.max(0, Math.round(pay - s["24"]));
}

/**
 * Snap Line 33 from components when blank; set Line 37a to IRS math (max(0, L24 − L33)).
 * Line 37 keeps a parsed as-filed amount when it disagrees with the formula; when they
 * agree within tolerance, Line 37 is set to the computed amount so the table ties out.
 */
function mirrorAgiIfOnlyOneLineFilled(s: Form1040Snapshot): void {
  const a = s["11a"];
  const b = s["11b"];
  const positive = [a, b].filter((v) => v > 0);
  if (positive.length !== 1) {
    return;
  }
  const v = positive[0]!;
  s["11a"] = v;
  s["11b"] = v;
}

const SCHEDULE_1_SUB_LINE_IDS: readonly Form1040LineId[] = [
  "1b",
  "1c",
  "1d",
  "1e",
  "1f",
  "1g",
  "1h",
  "1i",
];

/**
 * PDF scan often drops spurious 2s/small numbers on 1b–1i; 1z then wrongly exceeds 1a.
 * Clear when the pattern matches typical OCR noise (also runs on Recalculate).
 */
const LINE9_COMPONENT_IDS: readonly Form1040LineId[] = [
  "1z",
  "2b",
  "3b",
  "4b",
  "5b",
  "6b",
  "7a",
  "7b",
  "8",
];

/**
 * OCR sometimes puts total income on the Line 6b row; then Line 9 matches 6b and ignores 7b/8.
 * When 6b ≈ Line 9 but other income components sum to a large amount, re-derive taxable SS (6b).
 */
function fixLine6bWhenMisreadAsTotalIncome(s: Form1040Snapshot): void {
  const nine = Math.max(0, s["9"]);
  const six = Math.max(0, s["6b"]);
  if (six <= 0 || nine <= 0) {
    return;
  }
  if (Math.abs(six - nine) > 3) {
    return;
  }
  let rest = 0;
  for (const id of LINE9_COMPONENT_IDS) {
    if (id === "6b") {
      continue;
    }
    rest += id === "8" ? s[id] : Math.max(0, s[id]);
  }
  if (rest < 500) {
    return;
  }
  const implied = Math.max(0, nine - rest);
  if (implied > six * 0.55) {
    return;
  }
  s["6b"] = implied;
}

/** Line 9 should equal the sum of lines 1z, 2b, …, 8 on current-year Form 1040 (Line 8 may be negative). */
function recomputeLine9FromIncomeComponents(s: Form1040Snapshot): void {
  let sum = 0;
  for (const id of LINE9_COMPONENT_IDS) {
    sum += id === "8" ? s[id] : Math.max(0, s[id]);
  }
  const tol = Math.max(5, Math.round(Math.abs(sum) * 0.002));
  if (Math.abs(s["9"] - sum) > tol) {
    s["9"] = sum;
  }
}

/** Page-12 scan can grab Schedule 8812 / 8814 amounts as "line 12" or tiny OCR noise on 13a. */
function scrubBadDeductionAmounts(s: Form1040Snapshot): void {
  const rounded = Math.round(s["12e"]);
  if (rounded === 8812 || rounded === 8814) {
    s["12e"] = 0;
  }
  const agi = Math.max(s["11b"], s["11a"]);
  if (agi > 10_000 && s["13a"] > 0 && s["13a"] < 75) {
    s["13a"] = 0;
  }
}

/** Line 14 = 12e + 13a + 13b (2024+). Drop orphan Line 14 when no deduction lines parsed. */
function recomputeLine14FromDeductionComponents(s: Form1040Snapshot): void {
  const sum14 =
    Math.max(0, s["12e"]) +
    Math.max(0, s["13a"]) +
    Math.max(0, s["13b"]);
  if (sum14 <= 0) {
    if (s["14"] > 0) {
      s["14"] = 0;
    }
    return;
  }
  if (
    s["14"] <= 0 ||
    Math.abs(s["14"] - sum14) > Math.max(50, sum14 * 0.02)
  ) {
    s["14"] = sum14;
  }
}

function adjustedGrossIncomeSnapshot(s: Form1040Snapshot): number {
  return Math.max(s["11b"], s["11a"]);
}

/** Line 15 = max(0, AGI − Line 14) on 2024+ forms when blank or inconsistent. */
function recomputeLine15FromAgiAndLine14(s: Form1040Snapshot): void {
  const agi = adjustedGrossIncomeSnapshot(s);
  if (agi <= 0) {
    return;
  }
  const exp = Math.max(0, Math.round(agi - s["14"]));
  if (exp <= 0) {
    return;
  }
  if (
    s["15"] <= 0 ||
    Math.abs(s["15"] - exp) > Math.max(100, exp * 0.02)
  ) {
    s["15"] = exp;
  }
}

/**
 * Older parsers put Schedule 2 "other tax" on Line 21; 2024+ Line 21 is credits (19+20).
 * Move large Line 21 amounts to Line 23 when Line 23 is empty.
 */
function migrateMisplacedOtherTaxFromLine21(s: Form1040Snapshot): void {
  const credits = Math.max(0, s["19"]) + Math.max(0, s["20"]);
  const l21 = s["21"];
  if (l21 > credits + 500 && s["23"] < 100 && l21 >= 500) {
    s["23"] = l21;
    s["21"] = credits;
  }
}

/**
 * Tiny amounts on 19/20 often OCR noise when total tax ties to (16+17)+23 with no credits.
 */
function clearTinyCreditsWhenAnchoredToTotalTax(s: Form1040Snapshot): void {
  const a =
    Math.max(0, s["18"]) > 0
      ? Math.max(0, s["18"])
      : Math.max(0, s["17"]);
  const c = Math.max(0, s["19"]) + Math.max(0, s["20"]);
  const other = Math.max(0, s["23"]);
  const total = Math.max(0, s["24"]);
  if (a <= 0 || total <= 0 || c <= 0 || c >= 500 || other <= 0) {
    return;
  }
  const sumDirect = a + other;
  const netAfterCredits = Math.max(0, a - c) + other;
  if (
    Math.abs(total - sumDirect) <= 50 &&
    Math.abs(total - netAfterCredits) > 80
  ) {
    s["19"] = 0;
    s["20"] = 0;
  }
}

/** 2024+ Form 1040: 18 = 16+17; 21 = 19+20; 22 = max(0, 18−21); 24 = 22+23 (with Line 23 inferred if needed). */
function reconcileTaxLines2024Plus(s: Form1040Snapshot): void {
  migrateMisplacedOtherTaxFromLine21(s);

  let l18 = Math.max(0, s["18"]);
  if (l18 <= 0) {
    l18 = Math.max(0, s["17"]);
  }
  s["18"] = l18;

  let l21 = Math.max(0, s["19"]) + Math.max(0, s["20"]);
  s["21"] = l21;
  s["22"] = Math.max(0, s["18"] - s["21"]);

  if (s["18"] > 0 && s["23"] < 100 && s["24"] > s["22"] + 50) {
    s["23"] = Math.max(0, Math.round(s["24"] - s["22"]));
  }

  clearTinyCreditsWhenAnchoredToTotalTax(s);

  l21 = Math.max(0, s["19"]) + Math.max(0, s["20"]);
  s["21"] = l21;
  s["22"] = Math.max(0, s["18"] - s["21"]);

  if (s["18"] > 0 && s["23"] < 100 && s["24"] > s["22"] + 50) {
    s["23"] = Math.max(0, Math.round(s["24"] - s["22"]));
  }

  const sum24 = s["22"] + s["23"];
  if (sum24 > 0) {
    if (
      s["24"] <= 0 ||
      Math.abs(s["24"] - sum24) > Math.max(35, sum24 * 0.012)
    ) {
      s["24"] = sum24;
    }
  }
}

const TAX_SECTION_REPAIR_KEYS: readonly Form1040LineId[] = [
  "13b",
  "14",
  "15",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25a",
  "25b",
  "25c",
  "25d",
  "27",
  "32",
  "34",
  "35",
  "35c",
  "37",
  "37a",
  "37b",
];

/** Parse/merge repair for Line 14 (orphans), Line 15, Lines 18–24, OCR echo scrub, payments. */
export function repairTaxSectionPartial(p: Partial<Form1040Snapshot>): void {
  const s = partialToFullSnapshot(p);
  scrubOcrEchoAndFormRefAmounts(s);
  recomputeLine14FromDeductionComponents(s);
  recomputeLine15FromAgiAndLine14(s);
  reconcileTaxLines2024Plus(s);
  recomputeLine25dFromComponents(s);
  for (const k of TAX_SECTION_REPAIR_KEYS) {
    p[k] = s[k];
  }
}

const INCOME_DEDUCTION_REPAIR_KEYS: readonly Form1040LineId[] = [
  "6b",
  "9",
  "12e",
  "13a",
  "13b",
  "14",
];

/** Parse/merge repair for income through Line 14 (same rules as reconcile on Recalculate). */
export function repairIncomeDeductionBlockPartial(
  p: Partial<Form1040Snapshot>,
): void {
  const s = partialToFullSnapshot(p);
  fixLine6bWhenMisreadAsTotalIncome(s);
  recomputeLine9FromIncomeComponents(s);
  scrubBadDeductionAmounts(s);
  recomputeLine14FromDeductionComponents(s);
  for (const k of INCOME_DEDUCTION_REPAIR_KEYS) {
    p[k] = s[k];
  }
}

function primaryLineNumberFromId(id: Form1040LineId): number | undefined {
  const m = id.match(/^(\d+)/);
  return m ? Number.parseInt(m[1]!, 10) : undefined;
}

/**
 * PDF/OCR often grabs line numbers, form names (1099), or "line 38" as dollar amounts.
 */
function scrubOcrEchoAndFormRefAmounts(s: Form1040Snapshot): void {
  if (s["25b"] === 1099) {
    s["25b"] = 0;
  }
  if (s["13b"] === 38) {
    s["13b"] = 0;
  }
  if (s["37b"] === 38) {
    s["37b"] = 0;
  }
  if (s["35"] === 8888) {
    s["35"] = 0;
  }
  if (s["35c"] > 0 && s["35c"] !== 1 && s["35c"] !== 2) {
    s["35c"] = 0;
  }
  for (const id of ["27", "32", "34", "36"] as const) {
    const n = primaryLineNumberFromId(id);
    if (n !== undefined && s[id] === n) {
      s[id] = 0;
    }
  }
  if (s["25a"] === 25 && s["25b"] === 0 && s["25c"] === 25 && s["25d"] < 80) {
    s["25a"] = 0;
    s["25c"] = 0;
  }
  if (s["25d"] === 26 && s["25a"] + s["25b"] + s["25c"] === 0) {
    s["25d"] = 0;
  }
  if (
    (s["37"] === 24 || s["37a"] === 24) &&
    s["24"] > 500
  ) {
    s["37"] = 0;
    s["37a"] = 0;
  }
}

function recomputeLine25dFromComponents(s: Form1040Snapshot): void {
  const sum =
    Math.max(0, s["25a"]) + Math.max(0, s["25b"]) + Math.max(0, s["25c"]);
  if (sum <= 0) {
    return;
  }
  if (
    s["25d"] <= 0 ||
    Math.abs(s["25d"] - sum) > Math.max(5, sum * 0.02)
  ) {
    s["25d"] = sum;
  }
}

function sanitizeOcrJunkOnSchedule1Lines(s: Form1040Snapshot): void {
  const oneA = Math.max(0, s["1a"]);
  let subSum = 0;
  for (const id of SCHEDULE_1_SUB_LINE_IDS) {
    subSum += Math.max(0, s[id]);
  }
  const zTab = s["1z"];
  if (
    oneA >= 100 &&
    oneA <= 500_000 &&
    subSum > 0 &&
    subSum < 250 &&
    Math.abs(zTab - oneA - subSum) <= 3
  ) {
    const maxSub = Math.max(
      ...SCHEDULE_1_SUB_LINE_IDS.map((id) => Math.max(0, s[id])),
    );
    const manyTiny =
      SCHEDULE_1_SUB_LINE_IDS.filter((id) => {
        const v = s[id];
        return v > 0 && v <= 9;
      }).length >= 3;
    const junkPattern =
      subSum < oneA * 0.4 &&
      maxSub <= 50 &&
      (manyTiny || maxSub <= 35);
    if (junkPattern) {
      for (const id of SCHEDULE_1_SUB_LINE_IDS) {
        s[id] = 0;
      }
      s["1z"] = oneA;
      return;
    }
  }

  const vals = SCHEDULE_1_SUB_LINE_IDS.map((id) => s[id]).filter((v) => v > 0);
  if (vals.length >= 4) {
    const u = new Set(vals);
    if (u.size === 1 && [...u][0]! <= 9 && oneA > 100) {
      for (const id of SCHEDULE_1_SUB_LINE_IDS) {
        s[id] = 0;
      }
      s["1z"] = oneA;
    }
  }
}

const NON_NEGATIVE_LINE_IDS: readonly Form1040LineId[] = [
  "2b",
  "3a",
  "3b",
  "7b",
  "9",
  "13a",
  "13b",
  "14",
  "15",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25a",
  "25d",
];

function clampNonNegativeSnapshotAmounts(s: Form1040Snapshot): void {
  for (const id of NON_NEGATIVE_LINE_IDS) {
    if (s[id] < 0) {
      s[id] = 0;
    }
  }
}

export function reconcileForm1040Snapshot(input: Form1040Snapshot): Form1040Snapshot {
  const s = { ...input };
  const parsed35In = Math.max(0, s["35"]);
  const parsed37In = Math.max(0, s["37"]);
  clampNonNegativeSnapshotAmounts(s);
  sanitizeOcrJunkOnSchedule1Lines(s);
  scrubOcrEchoAndFormRefAmounts(s);
  fixLine6bWhenMisreadAsTotalIncome(s);
  recomputeLine9FromIncomeComponents(s);
  scrubBadDeductionAmounts(s);
  recomputeLine14FromDeductionComponents(s);
  recomputeLine15FromAgiAndLine14(s);
  reconcileTaxLines2024Plus(s);
  recomputeLine25dFromComponents(s);
  mirrorAgiIfOnlyOneLineFilled(s);

  const payments = rollupTotalPayments(s);
  const l24 = Math.max(0, s["24"]);
  const overpayment = Math.max(0, Math.round(payments - l24));
  const amountOwed = Math.max(0, Math.round(l24 - payments));

  s["34"] = overpayment;

  if (overpayment > 0) {
    s["37"] = 0;
    s["37a"] = 0;
    if (parsed35In > 0) {
      s["35"] = Math.min(parsed35In, overpayment);
    } else {
      s["35"] = overpayment;
    }
  } else {
    s["35"] = 0;
    s["37a"] = amountOwed;
    if (parsed37In > 0) {
      s["37"] = parsed37In;
    } else {
      s["37"] = amountOwed;
    }
  }
  return s;
}

/** Merge partial line items into a full snapshot (missing keys default to zero). */
export function partialToFullSnapshot(
  p: Partial<Form1040Snapshot>,
): Form1040Snapshot {
  const base = emptyForm1040Snapshot();
  for (const key of Object.keys(p) as Form1040LineId[]) {
    const v = p[key];
    if (v !== undefined && Number.isFinite(v)) {
      base[key] =
        key === "8" ? Math.round(v) : Math.max(0, Math.round(v));
    }
  }
  return base;
}

/**
 * When Line 37 was read from the return but withholding (Line 25d, etc.) is wrong,
 * set Line 25d so max(0, Line 24 − total payments) matches the as-filed amount owed.
 * Call during intake parse/merge only.
 */
export function implyTotalPaymentsFromParsedLine37(
  partial: Partial<Form1040Snapshot>,
): void {
  const full = partialToFullSnapshot(partial);
  const l24 = full["24"];
  const parsed37 = full["37"];
  if (l24 <= 0 || parsed37 <= 0) {
    return;
  }
  const rolled = rollupTotalPayments(full);
  const computed = Math.max(0, Math.round(l24 - rolled));
  if (computed === parsed37) {
    return;
  }
  const impliedPayments = Math.max(0, Math.round(l24 - parsed37));
  if (impliedPayments > l24 + 1) {
    return;
  }
  const cur25d = full["25d"];
  if ((partial["25d"] === undefined || cur25d === 0) && impliedPayments > 0) {
    partial["25d"] = impliedPayments;
  }
}

/** @deprecated Use {@link implyTotalPaymentsFromParsedLine37} */
export function implyLine33FromParsedLine37(
  partial: Partial<Form1040Snapshot>,
): void {
  implyTotalPaymentsFromParsedLine37(partial);
}

/**
 * Partial for upload merge: non-zero lines plus reconciled 34 / 35 / 37
 * (so baseline is not wiped with all-zero keys).
 */
export function parsedSnapshotToUploadPartial(full: Form1040Snapshot): Partial<Form1040Snapshot> {
  const p: Partial<Form1040Snapshot> = {};
  for (const row of FORM_1040_LINE_ROWS) {
    const v = full[row.id];
    if (v > 0 || v < 0) {
      p[row.id] = v;
    }
  }
  p["34"] = full["34"];
  p["35"] = full["35"];
  p["37"] = full["37"];
  p["37a"] = full["37a"];
  return p;
}

export function emptyForm1040Snapshot(): Form1040Snapshot {
  const s = {} as Form1040Snapshot;
  for (const row of FORM_1040_LINE_ROWS) {
    s[row.id] = 0;
  }
  return s;
}

/** Core dashboard fields map to these 1040 lines. */
export const CORE_LINE_KEYS = {
  wages: "1a",
  agi: "11b",
  taxableIncome: "15",
  taxAssessed: "24",
  federalWithholding: "25d",
} as const;

export type CoreProfileKey = keyof typeof CORE_LINE_KEYS;

/** AGI for core math: uses the greater of Line 11a and Line 11b. */
export function adjustedGrossIncomeFromSnapshot(s: Form1040Snapshot): number {
  return Math.max(s["11b"], s["11a"]);
}

export function snapshotToCoreProfile(s: Form1040Snapshot): {
  agi: number;
  taxableIncome: number;
  taxAssessed: number;
  wages: number;
  federalWithholding: number;
} {
  return {
    wages: s["1a"],
    agi: adjustedGrossIncomeFromSnapshot(s),
    taxableIncome: s["15"],
    taxAssessed: s["24"],
    federalWithholding: s["25d"],
  };
}

export function applyCoreToSnapshot(
  s: Form1040Snapshot,
  partial: Partial<Record<CoreProfileKey, number>>,
): Form1040Snapshot {
  const next = { ...s };
  for (const key of Object.keys(partial) as CoreProfileKey[]) {
    const v = partial[key];
    if (v !== undefined && Number.isFinite(v)) {
      const n = Math.max(0, v);
      if (key === "agi") {
        next["11a"] = n;
        next["11b"] = n;
      } else {
        next[CORE_LINE_KEYS[key]] = n;
      }
    }
  }
  return next;
}

export function mergeForm1040Snapshots(
  baseline: Form1040Snapshot,
  originalDoc?: Partial<Form1040Snapshot>,
  transcriptDoc?: Partial<Form1040Snapshot>,
): {
  merged: Form1040Snapshot;
  originalSide: Form1040Snapshot;
  adjustments: Array<{ id: Form1040LineId; from: number; to: number; label: string }>;
} {
  const labelById = new Map(
    FORM_1040_LINE_ROWS.map((r) => [r.id, r.label] as const),
  );
  const originalSide = applySnapshotPartial(baseline, originalDoc);
  const merged = { ...originalSide };
  const adjustments: Array<{
    id: Form1040LineId;
    from: number;
    to: number;
    label: string;
  }> = [];

  for (const row of FORM_1040_LINE_ROWS) {
    const transcriptValue = transcriptDoc?.[row.id];
    if (transcriptValue === undefined || !Number.isFinite(transcriptValue)) {
      continue;
    }
    const sanitized =
      row.id === "8"
        ? Math.round(transcriptValue)
        : Math.max(0, transcriptValue);
    if (sanitized !== originalSide[row.id]) {
      adjustments.push({
        id: row.id,
        from: originalSide[row.id],
        to: sanitized,
        label: labelById.get(row.id) ?? row.id,
      });
    }
    merged[row.id] = sanitized;
  }

  implyTotalPaymentsFromParsedLine37(merged);
  const reconciled = reconcileForm1040Snapshot(merged);

  return { merged: reconciled, originalSide, adjustments };
}

function applySnapshotPartial(
  base: Form1040Snapshot,
  partial?: Partial<Form1040Snapshot>,
): Form1040Snapshot {
  if (!partial) {
    return { ...base };
  }
  const next = { ...base };
  for (const row of FORM_1040_LINE_ROWS) {
    const v = partial[row.id];
    if (v !== undefined && Number.isFinite(v)) {
      next[row.id] =
        row.id === "8" ? Math.round(v) : Math.max(0, v);
    }
  }
  return next;
}

/** 2021 demo transcript scenario — fills lines used by the optimizer. */
export const PRELOADED_SNAPSHOT_2021: Form1040Snapshot = (() => {
  const s = emptyForm1040Snapshot();
  s["1a"] = 131_944;
  s["9"] = 145_663;
  s["11a"] = 145_663;
  s["11b"] = 145_663;
  s["15"] = 126_863;
  s["24"] = 25_211;
  s["25d"] = 7_592;
  s["37"] = 25_211 - 7_592;
  s["37a"] = s["37"];
  return s;
})();

export function defaultSnapshotForYear(year: number): Form1040Snapshot {
  return year === 2021 ? { ...PRELOADED_SNAPSHOT_2021 } : emptyForm1040Snapshot();
}

import type { Form1040LineId, Form1040Snapshot } from "@/lib/form-1040-snapshot";
import {
  FORM_1040_FIRST_TWO_PAGES_LINE_IDS,
  emptyForm1040Snapshot,
  partialToFullSnapshot,
} from "@/lib/form-1040-snapshot";

export { partialToFullSnapshot };

const ANY_AMT = "(\\d{1,3}(?:,\\d{3})*|\\d{1,7})(?:\\.\\d{2})?";

function normalizeDocText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[\t ]+/g, " ").trim();
}

function parseMoneyToken(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

function isLikelyTaxYear(n: number): boolean {
  return n >= 1900 && n <= 2100;
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

/** Regex that a layout row is the given Form 1040 line (handles 1a, 25d, 35b, 37b, etc.). */
export function lineRefRegexForId(id: Form1040LineId): RegExp {
  const s = id as string;
  if (s === "1z") {
    return /add\s+lines?\s+1a\s*(through|to|[-–])\s*1i|lines?\s+1a\s*[-–]\s*1i|line\s*1\s*z\b|^\s*1\s*z[\s.)]/i;
  }
  const m = s.match(/^(\d+)([a-z]*)$/i);
  if (!m) {
    return /$^/;
  }
  const n = m[1];
  const suf = (m[2] || "").toLowerCase();
  if (!suf) {
    return new RegExp(`(?:line\\s*)?${n}\\b(?!\\d)`, "i");
  }
  return new RegExp(
    `line\\s*${n}\\s*${suf}\\b|(?:^|[^\\d.])${n}\\s*${suf}\\b`,
    "i",
  );
}

function lineMatchesLineId(line: string, id: Form1040LineId): boolean {
  const lo = line.toLowerCase();
  if (id === "15" && /adjusted\s+gross/.test(lo) && !/taxable/.test(lo)) {
    return false;
  }
  if (id === "9" && /total\s+income\s+tax/.test(lo)) {
    return false;
  }
  if (
    id === "12e" &&
    /\b8812\b/.test(lo) &&
    !/line\s*12\s*e|standard\s+deduction\s+or\s+itemized/i.test(lo)
  ) {
    return false;
  }
  if (id === "7a") {
    if (
      /capital|schedule\s*d|4797|gain|loss/i.test(line) &&
      /(?:line\s*)?7\b(?!\s*[bd])/i.test(line)
    ) {
      return true;
    }
  }
  if (id === "7b") {
    if (/(?:line\s*)?7\s*b\b|not\s+required.*schedule\s*d/i.test(line)) {
      return true;
    }
  }
  return lineRefRegexForId(id).test(line);
}

/**
 * First pass: each PDF row → at most one line id (longest id wins: 25d before 2).
 */
function scanLayoutForLineRefs(
  layoutLines: string[],
  ids: readonly Form1040LineId[],
): Partial<Form1040Snapshot> {
  const out: Partial<Form1040Snapshot> = {};
  const sorted = [...ids].sort(
    (a, b) => b.length - a.length || b.localeCompare(a),
  );

  for (const line of layoutLines) {
    if (!/\d/.test(line)) {
      continue;
    }
    const v = lastMoneyOnLine(line);
    if (v === undefined) {
      continue;
    }
    for (const id of sorted) {
      if (out[id] !== undefined) {
        continue;
      }
      if (lineMatchesLineId(line, id)) {
        out[id] = v;
        break;
      }
    }
  }
  return out;
}

type LineRule = {
  id: Form1040LineId;
  match: RegExp;
};

/** Second pass: phrase-specific rows (only if still empty). */
const PAGE12_ROW_RULES: LineRule[] = [
  {
    id: "1z",
    match:
      /add\s+lines?\s+1a\s+through\s+1i|lines?\s+1a\s*[-–]\s*1i|total\s+of\s+lines?\s+1a/i,
  },
  {
    id: "1i",
    match:
      /nontaxable\s+combat|combat\s+pay\s+election|line\s*1\s*i\b|^\s*1\s*i[\s.)]/i,
  },
  { id: "1h", match: /other\s+earned\s+income|line\s*1\s*h\b|^\s*1\s*h[\s.)]/i },
  { id: "1g", match: /8919|line\s*1\s*g\b|^\s*1\s*g[\s.)]/i },
  { id: "1f", match: /8839|adoption|line\s*1\s*f\b|^\s*1\s*f[\s.)]/i },
  {
    id: "1e",
    match: /2441|dependent\s+care|line\s*1\s*e\b|^\s*1\s*e[\s.)]/i,
  },
  { id: "1d", match: /medicaid\s+waiver|line\s*1\s*d\b|^\s*1\s*d[\s.)]/i },
  {
    id: "1c",
    match: /tip\s+income|line\s*1\s*c\b|^\s*1\s*c[\s.)]/i,
  },
  {
    id: "1b",
    match: /household\s+employee|line\s*1\s*b\b|^\s*1\s*b[\s.)]/i,
  },
  {
    id: "2a",
    match: /tax-exempt\s+interest|tax\s+exempt|line\s*2\s*a\b|^\s*2\s*a[\s.)]/i,
  },
  { id: "2b", match: /taxable\s+interest|line\s*2\s*b\b|^\s*2\s*b[\s.)]/i },
  {
    id: "3a",
    match: /qualified\s+dividends|line\s*3\s*a\b|^\s*3\s*a[\s.)]/i,
  },
  { id: "3b", match: /ordinary\s+dividends|line\s*3\s*b\b|^\s*3\s*b[\s.)]/i },
  {
    id: "4a",
    match: /ira\s+distributions|line\s*4\s*a\b|^\s*4\s*a[\s.)]/i,
  },
  {
    id: "4b",
    match:
      /taxable\s+amount.*ira|ira.*taxable|line\s*4\s*b\b|^\s*4\s*b[\s.)]/i,
  },
  {
    id: "5a",
    match: /pensions?\s+and\s+annuities|line\s*5\s*a\b|^\s*5\s*a[\s.)]/i,
  },
  {
    id: "5b",
    match:
      /taxable\s+amount.*pension|pension.*taxable|line\s*5\s*b\b|^\s*5\s*b[\s.)]/i,
  },
  {
    id: "6a",
    match: /social\s+security\s+benefits|line\s*6\s*a\b|^\s*6\s*a[\s.)]/i,
  },
  {
    id: "6b",
    match:
      /taxable\s+amount.*social\s+security|line\s*6\s*b\b|^\s*6\s*b[\s.)]/i,
  },
  {
    id: "7a",
    match:
      /capital\s+gain|schedule\s*d|form\s*4797|line\s*7\s*a\b|^\s*7\s*a[\s.)]|(?<![\d])7\s*a\b/i,
  },
  {
    id: "7b",
    match: /not\s+required.*schedule\s*d|line\s*7\s*b\b|^\s*7\s*b[\s.)]/i,
  },
  {
    id: "11a",
    match:
      /subtract\s+line\s*10\s+from\s+line\s*9|adjusted\s+gross\s+income.*line\s*11\s*a|line\s*11\s*a\b|^\s*11\s*a[\s.)]/i,
  },
  {
    id: "11b",
    match:
      /amount\s+from\s+line\s*11\s*a|line\s*11\s*b\b|^\s*11\s*b[\s.)]/i,
  },
  {
    id: "12e",
    match:
      /line\s*12\s*e\b|^\s*12\s*e[\s.)]|standard\s+deduction\s+or\s+itemized|itemized\s+deductions(?!\s*from\s+schedule\s*1)/i,
  },
  {
    id: "13a",
    match:
      /line\s*13\s*a\b|^\s*13\s*a[\s.)]|qualified\s+business\s+income|form\s*8995|qbi/i,
  },
  {
    id: "13b",
    match: /line\s*13\s*b\b|^\s*13\s*b[\s.)]/i,
  },
  {
    id: "14",
    match:
      /add\s+lines?\s*12\s*e|add\s+lines?\s*12e|total\s+deductions.*\b14\b|line\s*14\b(?!\s*37)|^\s*14[\s.)]/i,
  },
  { id: "17", match: /schedule\s*2.*line\s*3|line\s*17\b|^\s*17[\s.)]/i },
  {
    id: "18",
    match:
      /add\s+lines?\s*16\s+and\s*17|subtract\s+line\s*21\s+from\s+line\s*18|line\s*18\b|^\s*18[\s.)]/i,
  },
  {
    id: "19",
    match:
      /child\s+tax\s+credit|other\s+dependents|schedule\s*8812|line\s*19\b|^\s*19[\s.)]/i,
  },
  { id: "20", match: /schedule\s*3.*line\s*8|line\s*20\b|^\s*20[\s.)]/i },
  {
    id: "21",
    match:
      /add\s+lines?\s*19\s+and\s*20|total\s+nonrefundable\s+credits|line\s*21\b|^\s*21[\s.)]/i,
  },
  {
    id: "22",
    match:
      /subtract\s+line\s*21\s+from\s+line\s*18|net\s+tax\s+before\s+other|line\s*22\b|^\s*22[\s.)]/i,
  },
  {
    id: "23",
    match:
      /schedule\s*2.*line\s*21|self-employment|other\s+taxes|line\s*23\b|^\s*23[\s.)]/i,
  },
  {
    id: "24",
    match:
      /add\s+lines?\s*22\s+and\s*23|this\s+is\s+your\s+total\s+tax|line\s*24\b|^\s*24[\s.)]/i,
  },
  {
    id: "25b",
    match:
      /1099.*withheld|withheld.*1099|line\s*25\s*b\b|^\s*25\s*b[\s.)]/i,
  },
  {
    id: "25c",
    match: /other\s+forms.*withheld|line\s*25\s*c\b|^\s*25\s*c[\s.)]/i,
  },
  {
    id: "25e",
    match: /schedule\s*3|refundable|line\s*25\s*e\b|^\s*25\s*e[\s.)]/i,
  },
  { id: "27", match: /earned\s+income\s+credit|eic|line\s*27\b|^\s*27[\s.)]/i },
  {
    id: "32",
    match:
      /total\s+other\s+payments|refundable|line\s*32\b|^\s*32[\s.)]/i,
  },
  {
    id: "34",
    match:
      /overpayment|line\s*34\b|^\s*34[\s.)]/i,
  },
  {
    id: "35",
    match:
      /amount.*refunded|line\s*35\s*a\b|line\s*35\b(?![bcd])|^\s*35[\s.)](?![bcd])/i,
  },
  { id: "35b", match: /routing|line\s*35\s*b\b|^\s*35\s*b[\s.)]/i },
  { id: "35c", match: /checking|savings|line\s*35\s*c\b|^\s*35\s*c[\s.)]/i },
  { id: "35d", match: /account\s+number|line\s*35\s*d\b|^\s*35\s*d[\s.)]/i },
  {
    id: "36",
    match: /estimated\s+tax|applied\s+to|line\s*36\b|^\s*36[\s.)]/i,
  },
  {
    id: "37",
    match:
      /amount\s+you\s+owe|balance\s+due|subtract\s+line\s*33\s+from\s+line\s*24|line\s*37\b(?!\s*[ab])|^\s*37[\s.)](?![ab])/i,
  },
  {
    id: "37b",
    match:
      /estimated\s+tax\s+penalty|form\s*2210|line\s*38\b|line\s*37\s*b\b|^\s*37\s*b[\s.)]/i,
  },
];

/** Line 24 PDF text often repeats "24"; do not treat that as $24 total tax. */
function isNumericEchoForLine24(v: number, capture: string): boolean {
  const core = capture.replace(/[$,\s]/g, "").replace(/\.\d{2}$/, "");
  return v > 0 && v < 100 && core.length <= 2;
}

function extractLineByNumberFallback(
  t: string,
  lineNum: string,
): number | undefined {
  const escaped = lineNum.replace(/(\d)([a-z])/gi, "$1\\s*$2");
  const patterns = [
    new RegExp(`line\\s*${escaped}\\b[^\\d]{0,160}?${ANY_AMT}`, "gi"),
    new RegExp(`(^|[^\\d])${escaped}\\s*[.:$\\s-]+${ANY_AMT}`, "gi"),
  ];
  for (const re of patterns) {
    const matches = [...t.matchAll(re)];
    for (const m of matches) {
      const cap = m[2] ?? m[1];
      if (!cap || isLikelyTaxYear(parseMoneyToken(cap))) {
        continue;
      }
      const v = parseMoneyToken(cap);
      if (v >= 0 && v < 100_000_000 && !isLikelyTaxYear(v)) {
        if (lineNum === "24" && isNumericEchoForLine24(v, cap)) {
          continue;
        }
        return v;
      }
    }
  }
  return undefined;
}

/**
 * Scan reconstructed layout lines + full text for Form 1040 page 1–2 amounts.
 */
export function extractPage12LineItems(
  layoutLines: string[],
  fullText: string,
): Partial<Form1040Snapshot> {
  const out: Partial<Form1040Snapshot> = {};
  const t = normalizeDocText(fullText);

  const fromLayout = scanLayoutForLineRefs(
    layoutLines,
    FORM_1040_FIRST_TWO_PAGES_LINE_IDS,
  );
  Object.assign(out, fromLayout);

  for (const line of layoutLines) {
    const v = lastMoneyOnLine(line);
    if (v === undefined) {
      continue;
    }
    for (const rule of PAGE12_ROW_RULES) {
      if (out[rule.id] !== undefined) {
        continue;
      }
      if (!rule.match.test(line)) {
        continue;
      }
      out[rule.id] = v;
      break;
    }
  }

  for (const id of FORM_1040_FIRST_TWO_PAGES_LINE_IDS) {
    if (out[id] !== undefined) {
      continue;
    }
    const v = extractLineByNumberFallback(t, id);
    if (v !== undefined) {
      out[id] = v;
    }
  }

  if (out["13b"] === 38) {
    delete out["13b"];
  }

  return out;
}

/** Merge page-12 scan into a partial snapshot without wiping higher-priority parses. */
export function mergePage12WithSpecialized(
  page12: Partial<Form1040Snapshot>,
  specialized: Partial<Form1040Snapshot>,
): Partial<Form1040Snapshot> {
  const merged: Partial<Form1040Snapshot> = { ...page12 };
  for (const key of Object.keys(specialized) as Form1040LineId[]) {
    const v = specialized[key];
    if (v !== undefined && Number.isFinite(v)) {
      merged[key] =
        key === "8" ? Math.round(v) : Math.max(0, v);
    }
  }
  return merged;
}

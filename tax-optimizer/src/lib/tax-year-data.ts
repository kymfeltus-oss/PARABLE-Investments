/**
 * IRS ordinary income brackets and standard deduction by tax year and filing status.
 * Bracket ceilings are inclusive upper bounds for each marginal rate segment.
 * Qualifying surviving spouse uses the same schedule as married filing jointly (IRC).
 * Sources: IRS Rev. Proc. / Form 1040 instructions; 2026 mirrors 2025 until finalized.
 */

export type TaxBracket = {
  ceiling: number;
  rate: number;
  label: string;
};

export type FilingStatus =
  | "single"
  | "married_joint"
  | "married_separate"
  | "head_of_household"
  | "qualifying_surviving_spouse";

export const FILING_STATUS_OPTIONS: ReadonlyArray<{
  value: FilingStatus;
  label: string;
}> = [
  { value: "single", label: "Single" },
  { value: "married_joint", label: "Married filing jointly" },
  { value: "married_separate", label: "Married filing separately" },
  { value: "head_of_household", label: "Head of household" },
  {
    value: "qualifying_surviving_spouse",
    label: "Qualifying surviving spouse",
  },
];

export type TaxYearConfig = {
  year: number;
  filingStatus: FilingStatus;
  standardDeduction: number;
  brackets: TaxBracket[];
  /** True when ceilings mirror prior year (e.g. unreleased IRS tables). */
  provisional?: boolean;
};

type Ceil6 = [number, number, number, number, number, number];

type StatusMoney = {
  standard: number;
  ceilings: Ceil6;
};

function bracketsFromCeilings(
  year: number,
  ceilings: Ceil6,
): TaxBracket[] {
  const [c10, c12, c22, c24, c32, c35] = ceilings;
  const fmt = (low: number, high: number, pct: number) =>
    `${pct}%: $${low.toLocaleString("en-US")} - $${high.toLocaleString("en-US")}`;
  return [
    { ceiling: c10, rate: 0.1, label: fmt(0, c10, 10) },
    { ceiling: c12, rate: 0.12, label: fmt(c10 + 1, c12, 12) },
    { ceiling: c22, rate: 0.22, label: fmt(c12 + 1, c22, 22) },
    { ceiling: c24, rate: 0.24, label: fmt(c22 + 1, c24, 24) },
    { ceiling: c32, rate: 0.32, label: fmt(c24 + 1, c32, 32) },
    { ceiling: c35, rate: 0.35, label: fmt(c32 + 1, c35, 35) },
    {
      ceiling: Number.POSITIVE_INFINITY,
      rate: 0.37,
      label: `37%: $${(c35 + 1).toLocaleString("en-US")}+`,
    },
  ];
}

/** Per-year amounts: Single, MFJ, MFS, HoH (QSS uses MFJ). */
const YEAR_TABLE: Record<
  number,
  {
    single: StatusMoney;
    married_joint: StatusMoney;
    married_separate: StatusMoney;
    head_of_household: StatusMoney;
    provisional?: boolean;
  }
> = {
  2018: {
    single: {
      standard: 12_000,
      ceilings: [9_525, 38_700, 82_500, 157_500, 200_000, 500_000],
    },
    married_joint: {
      standard: 24_000,
      ceilings: [19_050, 77_400, 165_000, 315_000, 400_000, 600_000],
    },
    married_separate: {
      standard: 12_000,
      ceilings: [9_525, 38_700, 82_500, 157_500, 200_000, 300_000],
    },
    head_of_household: {
      standard: 18_000,
      ceilings: [13_600, 51_800, 82_500, 157_500, 200_000, 500_000],
    },
  },
  2019: {
    single: {
      standard: 12_200,
      ceilings: [9_700, 39_475, 84_200, 160_725, 204_100, 510_300],
    },
    married_joint: {
      standard: 24_400,
      ceilings: [19_400, 78_950, 168_400, 321_450, 408_200, 612_350],
    },
    married_separate: {
      standard: 12_200,
      ceilings: [9_700, 39_475, 84_200, 160_725, 204_100, 306_175],
    },
    head_of_household: {
      standard: 18_350,
      ceilings: [13_850, 52_850, 84_200, 160_700, 204_100, 510_300],
    },
  },
  2020: {
    single: {
      standard: 12_400,
      ceilings: [9_875, 40_125, 85_525, 163_300, 207_350, 518_400],
    },
    married_joint: {
      standard: 24_800,
      ceilings: [19_750, 80_250, 171_050, 326_600, 414_700, 622_050],
    },
    married_separate: {
      standard: 12_400,
      ceilings: [9_875, 40_125, 85_525, 163_300, 207_350, 311_025],
    },
    head_of_household: {
      standard: 18_650,
      ceilings: [14_100, 53_700, 85_200, 163_300, 207_250, 518_400],
    },
  },
  2021: {
    single: {
      standard: 12_550,
      ceilings: [9_950, 40_525, 86_375, 164_925, 209_425, 523_600],
    },
    married_joint: {
      standard: 25_100,
      ceilings: [19_900, 81_050, 172_750, 329_850, 418_850, 628_300],
    },
    married_separate: {
      standard: 12_550,
      ceilings: [9_950, 40_525, 86_375, 164_925, 209_425, 314_150],
    },
    head_of_household: {
      standard: 18_800,
      ceilings: [14_200, 54_200, 86_350, 164_900, 209_400, 523_600],
    },
  },
  2022: {
    single: {
      standard: 12_950,
      ceilings: [10_275, 41_775, 89_075, 170_050, 215_950, 539_900],
    },
    married_joint: {
      standard: 25_900,
      ceilings: [20_550, 83_550, 178_150, 340_100, 431_900, 647_850],
    },
    married_separate: {
      standard: 12_950,
      ceilings: [10_275, 41_775, 89_075, 170_050, 215_950, 323_925],
    },
    head_of_household: {
      standard: 19_400,
      ceilings: [14_650, 55_900, 89_050, 170_050, 215_950, 539_900],
    },
  },
  2023: {
    single: {
      standard: 13_850,
      ceilings: [11_000, 44_725, 95_375, 182_100, 231_250, 578_125],
    },
    married_joint: {
      standard: 27_700,
      ceilings: [22_000, 89_450, 190_750, 364_200, 462_500, 693_750],
    },
    married_separate: {
      standard: 13_850,
      ceilings: [11_000, 44_725, 95_375, 182_100, 231_250, 346_875],
    },
    head_of_household: {
      standard: 20_800,
      ceilings: [15_700, 59_850, 95_350, 182_100, 231_250, 578_100],
    },
  },
  2024: {
    single: {
      standard: 14_600,
      ceilings: [11_600, 47_150, 100_525, 191_950, 243_725, 609_350],
    },
    married_joint: {
      standard: 29_200,
      ceilings: [23_200, 94_300, 201_050, 383_900, 487_450, 731_200],
    },
    married_separate: {
      standard: 14_600,
      ceilings: [11_600, 47_150, 100_525, 191_950, 243_725, 365_600],
    },
    head_of_household: {
      standard: 21_900,
      ceilings: [16_550, 63_100, 100_500, 191_950, 243_700, 609_350],
    },
  },
  2025: {
    single: {
      standard: 15_750,
      ceilings: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
    },
    married_joint: {
      standard: 31_500,
      ceilings: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
    },
    married_separate: {
      standard: 15_750,
      ceilings: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
    },
    head_of_household: {
      standard: 23_625,
      ceilings: [16_750, 63_850, 101_050, 192_450, 244_550, 610_350],
    },
  },
  2026: {
    single: {
      standard: 15_750,
      ceilings: [11_925, 48_475, 103_350, 197_300, 250_525, 626_350],
    },
    married_joint: {
      standard: 31_500,
      ceilings: [23_850, 96_950, 206_700, 394_600, 501_050, 751_600],
    },
    married_separate: {
      standard: 15_750,
      ceilings: [11_925, 48_475, 103_350, 197_300, 250_525, 375_800],
    },
    head_of_household: {
      standard: 23_625,
      ceilings: [16_750, 63_850, 101_050, 192_450, 244_550, 610_350],
    },
    provisional: true,
  },
};

const SUPPORTED_YEARS = Object.keys(YEAR_TABLE)
  .map(Number)
  .sort((a, b) => a - b);

export function getSupportedTaxYears(): number[] {
  return [...SUPPORTED_YEARS];
}

function statusBlockForYear(
  row: (typeof YEAR_TABLE)[number],
  filingStatus: FilingStatus,
): StatusMoney {
  if (filingStatus === "qualifying_surviving_spouse") {
    return row.married_joint;
  }
  return row[filingStatus];
}

/**
 * Brackets and standard deduction for a tax year and filing status.
 * Defaults to Head of household if omitted (legacy behavior).
 */
export function getTaxYearConfig(
  year: number,
  filingStatus: FilingStatus = "head_of_household",
): TaxYearConfig | null {
  const row = YEAR_TABLE[year];
  if (!row) {
    return null;
  }
  const block = statusBlockForYear(row, filingStatus);
  const std = block.standard;
  const ceilings = block.ceilings;
  return {
    year,
    filingStatus,
    standardDeduction: std,
    brackets: bracketsFromCeilings(year, ceilings),
    provisional: row.provisional,
  };
}

/** @deprecated Use getTaxYearConfig(year, status).standardDeduction */
export function getStandardDeductionHoH(year: number): number {
  return getTaxYearConfig(year, "head_of_household")?.standardDeduction ?? 0;
}

/** Nearest supported year at or below `year` (for pickers typing 2017 etc.). */
export function clampToSupportedTaxYear(year: number): number {
  if (year >= SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1]) {
    return SUPPORTED_YEARS[SUPPORTED_YEARS.length - 1];
  }
  if (year <= SUPPORTED_YEARS[0]) {
    return SUPPORTED_YEARS[0];
  }
  let best = SUPPORTED_YEARS[0];
  for (const y of SUPPORTED_YEARS) {
    if (y <= year) {
      best = y;
    }
  }
  return best;
}

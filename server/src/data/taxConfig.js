export const PAYE_BANDS_2026 = [
  { cap: 800000, rate: 0 },
  { cap: 2200000, rate: 0.15 },
  { cap: 9000000, rate: 0.18 },
  { cap: 13000000, rate: 0.21 },
  { cap: 25000000, rate: 0.23 },
  { cap: Number.POSITIVE_INFINITY, rate: 0.25 }
];

export const SMALL_COMPANY_THRESHOLD = 100000000;
export const COMPANY_INCOME_TAX_RATE = 0.3;
export const DEVELOPMENT_LEVY_RATE = 0.04;
export const MINIMUM_TAX_RATE = 0.005;
export const GLOBAL_MINIMUM_TAX_RATE = 0.15;

export const TAX_ASSUMPTIONS = [
  "PAYE deductions include rent, pension, NHF, NHIS, life insurance, and housing-loan interest.",
  "The PAYE band model follows the reform structure already reflected in this project and public reform summaries from late 2025. Treat the output as an estimate, not filing advice.",
  "The small-company threshold uses the N100m service position discussed in the LIRS reform summary."
];

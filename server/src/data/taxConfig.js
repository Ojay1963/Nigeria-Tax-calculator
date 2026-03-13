export const PAYE_BANDS_2026 = [
  { cap: 800000, rate: 0 },
  { cap: 2200000, rate: 0.15 },
  { cap: 9000000, rate: 0.18 },
  { cap: 13000000, rate: 0.21 },
  { cap: 25000000, rate: 0.23 },
  { cap: Number.POSITIVE_INFINITY, rate: 0.25 }
];

export const ANNUAL_MINIMUM_WAGE_EXEMPTION = 840000;
export const SMALL_COMPANY_TURNOVER_THRESHOLD = 50000000;
export const SMALL_COMPANY_FIXED_ASSETS_THRESHOLD = 250000000;
export const COMPANY_INCOME_TAX_RATE = 0.3;
export const DEVELOPMENT_LEVY_RATE = 0.04;
export const MINIMUM_TAX_RATE = 0.005;
export const GLOBAL_MINIMUM_TAX_RATE = 0.15;
export const GLOBAL_MINIMUM_TAX_TURNOVER_THRESHOLD = 20000000000;

export const TAX_ASSUMPTIONS = [
  "PAYE follows the Fourth Schedule rates in the Nigeria Tax Act, 2025 and applies the employment-income exemption where annual income does not exceed the extant national minimum wage.",
  "The PAYE deductions surfaced in the calculator reflect the Act's listed relief items, including pension, NHF, NHIS, life assurance, owner-occupied mortgage interest, and residential rent relief.",
  "A company is treated as small only where turnover does not exceed N50,000,000, fixed assets do not exceed N250,000,000, and the company is not carrying on professional services.",
  "Company tax is estimated at 30% of taxable profit for non-small companies, 4% development levy on assessable profits for chargeable companies, and 0.5% minimum tax where taxable profit is zero or negative.",
  "The 15% effective-tax-rate top-up is only checked where turnover is at least N20,000,000,000 or the company is flagged as a constituent entity of an MNE group."
];

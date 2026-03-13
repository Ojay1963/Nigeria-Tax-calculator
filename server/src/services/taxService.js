import {
  COMPANY_INCOME_TAX_RATE,
  DEVELOPMENT_LEVY_RATE,
  GLOBAL_MINIMUM_TAX_RATE,
  MINIMUM_TAX_RATE,
  PAYE_BANDS_2026,
  SMALL_COMPANY_THRESHOLD,
  TAX_ASSUMPTIONS
} from "../data/taxConfig.js";

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumDeductions(deductions) {
  return Object.values(deductions).reduce((total, current) => total + Number(current || 0), 0);
}

function calculateProgressiveTax(amount, bands) {
  let remaining = amount;
  let tax = 0;
  let marginalRate = 0;

  for (const band of bands) {
    if (remaining <= 0) {
      break;
    }

    const taxableSlice = Math.min(remaining, band.cap);
    tax += taxableSlice * band.rate;
    remaining -= taxableSlice;

    if (taxableSlice > 0) {
      marginalRate = band.rate;
    }
  }

  return {
    tax: roundCurrency(tax),
    marginalRate
  };
}

export function getPayeEstimate(input) {
  const annualIncome = Number(input.annualIncome || 0);
  const totalDeductions = sumDeductions({
    rent: input.rent,
    pension: input.pension,
    nhf: input.nhf,
    nhis: input.nhis,
    lifeInsurance: input.lifeInsurance,
    housingLoanInterest: input.housingLoanInterest
  });

  const taxableIncome = Math.max(0, annualIncome - totalDeductions);
  const { tax, marginalRate } = calculateProgressiveTax(taxableIncome, PAYE_BANDS_2026);
  const effectiveRate = annualIncome > 0 ? tax / annualIncome : 0;

  return {
    annualIncome: roundCurrency(annualIncome),
    totalDeductions: roundCurrency(totalDeductions),
    taxableIncome: roundCurrency(taxableIncome),
    annualTax: tax,
    monthlyTax: roundCurrency(tax / 12),
    effectiveRate,
    marginalRate,
    assumptions: TAX_ASSUMPTIONS
  };
}

export function getCompanyTaxEstimate(input) {
  const annualTurnover = Number(input.annualTurnover || 0);
  const taxableProfit = Number(input.taxableProfit || 0);
  const frankedInvestmentIncome = Number(input.frankedInvestmentIncome || 0);
  const coveredTaxesPaid = Number(input.coveredTaxesPaid || 0);
  const isLargeQualifyingEntity = Boolean(input.isLargeQualifyingEntity);
  const isSmallCompany = annualTurnover <= SMALL_COMPANY_THRESHOLD;

  const companyIncomeTax = isSmallCompany || taxableProfit <= 0 ? 0 : taxableProfit * COMPANY_INCOME_TAX_RATE;
  const developmentLevy = isSmallCompany || taxableProfit <= 0 ? 0 : taxableProfit * DEVELOPMENT_LEVY_RATE;
  const minimumTaxBase = Math.max(0, annualTurnover - frankedInvestmentIncome);
  const minimumTax =
    !isSmallCompany && taxableProfit <= 0 ? roundCurrency(minimumTaxBase * MINIMUM_TAX_RATE) : 0;

  const standardTaxes = companyIncomeTax + developmentLevy + minimumTax;
  const globalMinimumTopUpTax =
    isLargeQualifyingEntity && taxableProfit > 0
      ? Math.max(0, taxableProfit * GLOBAL_MINIMUM_TAX_RATE - coveredTaxesPaid)
      : 0;

  const totalEstimatedTax = roundCurrency(standardTaxes + globalMinimumTopUpTax);

  let note = "This estimate assumes a standard large-company case.";
  if (isSmallCompany) {
    note = "This business falls within the small-company threshold used in the current app assumptions, so income tax is estimated at 0%.";
  } else if (minimumTax > 0) {
    note = "Minimum tax was used because taxable profit is zero or negative in the submitted figures.";
  } else if (globalMinimumTopUpTax > 0) {
    note = "A global minimum top-up was added because the covered taxes paid are below the 15% check for a qualifying large entity.";
  }

  return {
    classification: isSmallCompany ? "Small company" : "Large company",
    annualTurnover: roundCurrency(annualTurnover),
    taxableProfit: roundCurrency(taxableProfit),
    companyIncomeTax: roundCurrency(companyIncomeTax),
    developmentLevy: roundCurrency(developmentLevy),
    minimumTax,
    globalMinimumTopUpTax: roundCurrency(globalMinimumTopUpTax),
    totalEstimatedTax,
    note,
    assumptions: TAX_ASSUMPTIONS
  };
}

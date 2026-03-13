import {
  ANNUAL_MINIMUM_WAGE_EXEMPTION,
  COMPANY_INCOME_TAX_RATE,
  DEVELOPMENT_LEVY_RATE,
  GLOBAL_MINIMUM_TAX_RATE,
  GLOBAL_MINIMUM_TAX_TURNOVER_THRESHOLD,
  MINIMUM_TAX_RATE,
  PAYE_BANDS_2026,
  SMALL_COMPANY_FIXED_ASSETS_THRESHOLD,
  SMALL_COMPANY_TURNOVER_THRESHOLD,
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
  const isMinimumWageExempt = annualIncome > 0 && annualIncome <= ANNUAL_MINIMUM_WAGE_EXEMPTION;
  const { tax, marginalRate } = isMinimumWageExempt
    ? { tax: 0, marginalRate: 0 }
    : calculateProgressiveTax(taxableIncome, PAYE_BANDS_2026);
  const effectiveRate = annualIncome > 0 ? tax / annualIncome : 0;

  return {
    annualIncome: roundCurrency(annualIncome),
    totalDeductions: roundCurrency(totalDeductions),
    taxableIncome: roundCurrency(taxableIncome),
    annualTax: tax,
    monthlyTax: roundCurrency(tax / 12),
    effectiveRate,
    marginalRate,
    isMinimumWageExempt,
    assumptions: TAX_ASSUMPTIONS
  };
}

export function getCompanyTaxEstimate(input) {
  const annualTurnover = Number(input.annualTurnover || 0);
  const taxableProfit = Number(input.taxableProfit || 0);
  const assessableProfit = Number(input.assessableProfit || 0);
  const frankedInvestmentIncome = Number(input.frankedInvestmentIncome || 0);
  const fixedAssets = Number(input.fixedAssets || 0);
  const netProfitBeforeTax = Number(input.netProfitBeforeTax || 0);
  const depreciationExpense = Number(input.depreciationExpense || 0);
  const personnelCost = Number(input.personnelCost || 0);
  const coveredTaxesPaid = Number(input.coveredTaxesPaid || 0);
  const isMNEConstituentEntity = Boolean(input.isMNEConstituentEntity);
  const isProfessionalServicesBusiness = Boolean(input.isProfessionalServicesBusiness);
  const isSmallCompany =
    annualTurnover <= SMALL_COMPANY_TURNOVER_THRESHOLD &&
    fixedAssets <= SMALL_COMPANY_FIXED_ASSETS_THRESHOLD &&
    !isProfessionalServicesBusiness;
  const companyClassification = isSmallCompany ? "Small company" : "Chargeable company";
  const companyIncomeTaxRate = isSmallCompany ? 0 : COMPANY_INCOME_TAX_RATE;

  const companyIncomeTax = isSmallCompany || taxableProfit <= 0 ? 0 : taxableProfit * companyIncomeTaxRate;
  const developmentLevy =
    isSmallCompany || assessableProfit <= 0 ? 0 : assessableProfit * DEVELOPMENT_LEVY_RATE;
  const minimumTaxBase = Math.max(0, annualTurnover - frankedInvestmentIncome);
  const minimumTax =
    !isSmallCompany && taxableProfit <= 0 ? roundCurrency(minimumTaxBase * MINIMUM_TAX_RATE) : 0;

  const globalMinimumTaxProfitBase = Math.max(
    0,
    netProfitBeforeTax - 0.05 * (depreciationExpense + personnelCost)
  );
  const isEffectiveTaxRuleApplicable =
    annualTurnover >= GLOBAL_MINIMUM_TAX_TURNOVER_THRESHOLD || isMNEConstituentEntity;
  const standardTaxes = companyIncomeTax + developmentLevy + minimumTax;
  const globalMinimumTopUpTax =
    isEffectiveTaxRuleApplicable && globalMinimumTaxProfitBase > 0
      ? Math.max(0, globalMinimumTaxProfitBase * GLOBAL_MINIMUM_TAX_RATE - coveredTaxesPaid)
      : 0;

  const totalEstimatedTax = roundCurrency(standardTaxes + globalMinimumTopUpTax);

  let note = "This estimate applies the Nigeria Tax Act, 2025 company-tax rules reflected in the current calculator inputs.";
  if (isSmallCompany) {
    note =
      "This company meets the Act's small-company conditions, so company income tax, development levy, and minimum tax are estimated at 0%.";
  } else if (minimumTax > 0) {
    note =
      "Minimum tax was triggered because taxable profit is zero or negative in the submitted figures.";
  } else if (globalMinimumTopUpTax > 0) {
    note =
      "A global minimum top-up was added because the covered taxes paid are below the 15% effective-tax-rate check for a qualifying large group or MNE entity.";
  } else if (isProfessionalServicesBusiness) {
    note =
      "Professional-services companies do not qualify for the Act's small-company treatment, even where turnover is below the turnover threshold.";
  }

  return {
    classification: companyClassification,
    annualTurnover: roundCurrency(annualTurnover),
    assessableProfit: roundCurrency(assessableProfit),
    taxableProfit: roundCurrency(taxableProfit),
    fixedAssets: roundCurrency(fixedAssets),
    companyIncomeTaxRate,
    companyIncomeTax: roundCurrency(companyIncomeTax),
    developmentLevy: roundCurrency(developmentLevy),
    minimumTax,
    globalMinimumTaxProfitBase: roundCurrency(globalMinimumTaxProfitBase),
    isEffectiveTaxRuleApplicable,
    globalMinimumTopUpTax: roundCurrency(globalMinimumTopUpTax),
    totalEstimatedTax,
    note,
    assumptions: TAX_ASSUMPTIONS
  };
}

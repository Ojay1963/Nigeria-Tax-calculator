import assert from "node:assert/strict";
import request from "supertest";
import { getCompanyTaxEstimate, getPayeEstimate } from "../src/services/taxService.js";

async function run() {
  process.env.NODE_ENV = "test";

  const { default: app } = await import("../src/app.js");
  const payeResult = getPayeEstimate({
    annualIncome: 2500000,
    rent: 200000,
    pension: 100000,
    nhf: 50000,
    nhis: 20000,
    lifeInsurance: 15000,
    housingLoanInterest: 0
  });

  assert.equal(payeResult.taxableIncome, 2115000);
  assert.equal(payeResult.annualTax, 197250);
  assert.equal(payeResult.monthlyTax, 16437.5);
  assert.equal(payeResult.marginalRate, 0.15);
  assert.equal(payeResult.isMinimumWageExempt, false);

  const minimumWagePayeResult = getPayeEstimate({
    annualIncome: 840000,
    rent: 0,
    pension: 0,
    nhf: 0,
    nhis: 0,
    lifeInsurance: 0,
    housingLoanInterest: 0
  });

  assert.equal(minimumWagePayeResult.annualTax, 0);
  assert.equal(minimumWagePayeResult.isMinimumWageExempt, true);

  const smallCompanyResult = getCompanyTaxEstimate({
    annualTurnover: 45000000,
    assessableProfit: 6500000,
    taxableProfit: 6500000,
    frankedInvestmentIncome: 0,
    fixedAssets: 150000000,
    netProfitBeforeTax: 7000000,
    depreciationExpense: 250000,
    personnelCost: 1800000,
    isProfessionalServicesBusiness: false,
    isMNEConstituentEntity: false,
    coveredTaxesPaid: 0
  });

  assert.equal(smallCompanyResult.classification, "Small company");
  assert.equal(smallCompanyResult.totalEstimatedTax, 0);

  const professionalServicesResult = getCompanyTaxEstimate({
    annualTurnover: 30000000,
    assessableProfit: 12000000,
    taxableProfit: 10000000,
    frankedInvestmentIncome: 0,
    fixedAssets: 18000000,
    netProfitBeforeTax: 12500000,
    depreciationExpense: 400000,
    personnelCost: 5500000,
    isProfessionalServicesBusiness: true,
    isMNEConstituentEntity: false,
    coveredTaxesPaid: 0
  });

  assert.equal(professionalServicesResult.classification, "Chargeable company");
  assert.equal(professionalServicesResult.companyIncomeTax, 3000000);
  assert.equal(professionalServicesResult.developmentLevy, 480000);

  const largeCompanyResult = getCompanyTaxEstimate({
    annualTurnover: 120000000,
    assessableProfit: 22000000,
    taxableProfit: 20000000,
    frankedInvestmentIncome: 0,
    fixedAssets: 150000000,
    netProfitBeforeTax: 25000000,
    depreciationExpense: 1000000,
    personnelCost: 7000000,
    isProfessionalServicesBusiness: false,
    isMNEConstituentEntity: false,
    coveredTaxesPaid: 0
  });

  assert.equal(largeCompanyResult.companyIncomeTax, 6000000);
  assert.equal(largeCompanyResult.developmentLevy, 880000);
  assert.equal(largeCompanyResult.totalEstimatedTax, 6880000);

  const effectiveTaxRuleResult = getCompanyTaxEstimate({
    annualTurnover: 23000000000,
    assessableProfit: 180000000,
    taxableProfit: 130000000,
    frankedInvestmentIncome: 10000000,
    fixedAssets: 260000000,
    netProfitBeforeTax: 200000000,
    depreciationExpense: 10000000,
    personnelCost: 25000000,
    isProfessionalServicesBusiness: false,
    isMNEConstituentEntity: true,
    coveredTaxesPaid: 12000000
  });

  assert.equal(effectiveTaxRuleResult.isEffectiveTaxRuleApplicable, true);
  assert.equal(effectiveTaxRuleResult.globalMinimumTaxProfitBase, 198250000);
  assert.equal(effectiveTaxRuleResult.globalMinimumTopUpTax, 17737500);

  const healthResponse = await request(app).get("/api/health");
  assert.equal(healthResponse.status, 200);
  assert.equal(healthResponse.body.status, "ok");

  const readyResponse = await request(app).get("/api/ready");
  assert.equal(readyResponse.status, 200);
  assert.equal(readyResponse.body.status, "ready");

  const payeResponse = await request(app).post("/api/tax/paye").send({
    annualIncome: 2500000,
    rent: 200000,
    pension: 100000,
    nhf: 50000,
    nhis: 20000,
    lifeInsurance: 15000,
    housingLoanInterest: 0
  });
  assert.equal(payeResponse.status, 200);
  assert.equal(payeResponse.body.data.annualTax, 197250);

  const invalidCompanyResponse = await request(app).post("/api/tax/company").send({
    annualTurnover: -5
  });
  assert.equal(invalidCompanyResponse.status, 400);

  const assumptionsResponse = await request(app).get("/api/tax/assumptions");
  assert.equal(assumptionsResponse.status, 200);
  assert.ok(Array.isArray(assumptionsResponse.body.data));

  const registerResponse = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  });
  assert.equal(registerResponse.status, 503);

  const adminMessagesResponse = await request(app).get("/api/admin/messages");
  assert.equal(adminMessagesResponse.status, 503);

  console.log("All server smoke tests passed.");
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});

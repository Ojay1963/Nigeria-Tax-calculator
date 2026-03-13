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

  const smallCompanyResult = getCompanyTaxEstimate({
    annualTurnover: 45000000,
    taxableProfit: 6500000,
    frankedInvestmentIncome: 0,
    fixedAssets: 5000000,
    isLargeQualifyingEntity: false,
    coveredTaxesPaid: 0
  });

  assert.equal(smallCompanyResult.classification, "Small company");
  assert.equal(smallCompanyResult.totalEstimatedTax, 0);

  const largeCompanyResult = getCompanyTaxEstimate({
    annualTurnover: 120000000,
    taxableProfit: 20000000,
    frankedInvestmentIncome: 0,
    fixedAssets: 0,
    isLargeQualifyingEntity: false,
    coveredTaxesPaid: 0
  });

  assert.equal(largeCompanyResult.companyIncomeTax, 6000000);
  assert.equal(largeCompanyResult.developmentLevy, 800000);
  assert.equal(largeCompanyResult.totalEstimatedTax, 6800000);

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

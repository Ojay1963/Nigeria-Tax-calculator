import express from "express";
import { z } from "zod";
import { CalculationRun } from "../models/CalculationRun.js";
import { TAX_ASSUMPTIONS } from "../data/taxConfig.js";
import { isDatabaseReady } from "../services/databaseService.js";
import { getCompanyTaxEstimate, getPayeEstimate } from "../services/taxService.js";

const router = express.Router();

const currencyField = z.coerce.number().min(0);

const payeSchema = z.object({
  annualIncome: currencyField,
  rent: currencyField.default(0),
  pension: currencyField.default(0),
  nhf: currencyField.default(0),
  nhis: currencyField.default(0),
  lifeInsurance: currencyField.default(0),
  housingLoanInterest: currencyField.default(0)
});

const companySchema = z.object({
  annualTurnover: currencyField,
  assessableProfit: z.coerce.number(),
  taxableProfit: z.coerce.number(),
  frankedInvestmentIncome: currencyField.default(0),
  fixedAssets: currencyField.default(0),
  netProfitBeforeTax: z.coerce.number().default(0),
  depreciationExpense: currencyField.default(0),
  personnelCost: currencyField.default(0),
  isProfessionalServicesBusiness: z.coerce.boolean().default(false),
  isMNEConstituentEntity: z.coerce.boolean().default(false),
  coveredTaxesPaid: currencyField.default(0)
});

router.get("/assumptions", (_req, res) => {
  res.json({
    data: TAX_ASSUMPTIONS
  });
});

router.post("/paye", async (req, res, next) => {
  const parsed = payeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide valid PAYE input fields.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const result = getPayeEstimate(parsed.data);
    if (isDatabaseReady()) {
      await CalculationRun.create({
        type: "paye",
        input: parsed.data,
        output: result,
        requestedByUserId: req.user?._id || null
      });
    }
    res.json({
      message: "PAYE estimate created successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.post("/company", async (req, res, next) => {
  const parsed = companySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide valid company-tax input fields.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const result = getCompanyTaxEstimate(parsed.data);
    if (isDatabaseReady()) {
      await CalculationRun.create({
        type: "company",
        input: parsed.data,
        output: result,
        requestedByUserId: req.user?._id || null
      });
    }
    res.json({
      message: "Company tax estimate created successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;

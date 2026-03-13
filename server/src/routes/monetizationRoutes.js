import express from "express";
import { z } from "zod";
import { createMonetizationRequest } from "../services/monetizationService.js";

const router = express.Router();

const baseSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().trim().optional().default(""),
  companyName: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
  taxUseCase: z.string().trim().optional().default(""),
  context: z.record(z.any()).optional().default({})
});

const supportLeadSchema = baseSchema.extend({
  type: z.literal("support_lead")
});

const consultationSchema = baseSchema.extend({
  type: z.literal("consultation"),
  consultationType: z.string().min(2),
  preferredDate: z.string().trim().optional().default(""),
  preferredTime: z.string().trim().optional().default("")
});

const pdfReportSchema = baseSchema.extend({
  type: z.literal("pdf_report"),
  calculationType: z.string().min(2),
  reportScope: z.string().min(2)
});

const subscriptionSchema = baseSchema.extend({
  type: z.literal("subscription"),
  selectedPlan: z.string().min(2)
});

const requestSchema = z.discriminatedUnion("type", [
  supportLeadSchema,
  consultationSchema,
  pdfReportSchema,
  subscriptionSchema
]);

router.get("/plans", (_req, res) => {
  res.json({
    data: [
      {
        id: "starter",
        name: "Starter",
        priceLabel: "Free",
        audience: "Individuals and one-off users",
        features: ["Calculator access", "Guide and FAQ", "Support lead capture"]
      },
      {
        id: "pro-report",
        name: "Pro Report",
        priceLabel: "From N5,000",
        audience: "Users who need a branded PDF summary",
        features: ["Reviewed PDF summary", "Scenario notes", "Delivery follow-up"]
      },
      {
        id: "business",
        name: "Business",
        priceLabel: "From N25,000/month",
        audience: "SMEs, HR teams, and finance users",
        features: ["Saved scenarios", "Priority support", "Team and workflow setup"]
      }
    ]
  });
});

router.post("/request", async (req, res, next) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide valid monetization request details.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const record = await createMonetizationRequest(parsed.data, req.user?._id || null);
    res.status(201).json({
      message: "Request submitted successfully.",
      data: {
        id: record._id.toString(),
        type: record.type,
        status: record.status
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;

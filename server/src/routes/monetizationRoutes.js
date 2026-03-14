import express from "express";
import fs from "fs";
import { z } from "zod";
import {
  createMonetizationRequest,
  ensurePaidReportGenerated,
  getMonetizationPlans,
  initializeMonetizationCheckout,
  markMonetizationFromWebhook,
  verifyMonetizationPayment
} from "../services/monetizationService.js";
import { MonetizationRequest } from "../models/MonetizationRequest.js";
import { isDatabaseReady } from "../services/databaseService.js";
import { isValidPaystackWebhook } from "../services/paystackService.js";

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

const paymentSchema = z.discriminatedUnion("type", [consultationSchema, pdfReportSchema, subscriptionSchema]);

function buildDownloadUrl(req, reference) {
  return `${req.protocol}://${req.get("host")}/api/monetization/download/${encodeURIComponent(reference)}`;
}

router.get("/plans", (_req, res) => {
  res.json({
    provider: "paystack",
    currency: "NGN",
    data: getMonetizationPlans()
  });
});

router.post("/request", async (req, res, next) => {
  const parsed = supportLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide valid support request details.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const record = await createMonetizationRequest(parsed.data, req.user?._id || null);
    res.status(201).json({
      message: "Support request submitted successfully.",
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

router.post("/checkout", async (req, res, next) => {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide valid payment details.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const { record, authorizationUrl, reference } = await initializeMonetizationCheckout(
      parsed.data,
      req.user?._id || null
    );

    res.status(201).json({
      message: "Paystack checkout initialized.",
      data: {
        id: record._id.toString(),
        reference,
        amount: record.amount,
        currency: record.currency,
        authorizationUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", async (req, res, next) => {
  const reference = typeof req.query.reference === "string" ? req.query.reference.trim() : "";

  if (!reference) {
    res.status(400).json({
      message: "Payment reference is required."
    });
    return;
  }

  try {
    const { record, verification } = await verifyMonetizationPayment(reference);
    res.json({
      message: verification.status === "success" ? "Payment verified successfully." : "Payment verification failed.",
      data: {
        id: record._id.toString(),
        type: record.type,
        status: record.status,
        paymentStatus: record.paymentStatus,
        amount: record.amount,
        currency: record.currency,
        reference: record.paymentReference,
        downloadUrl:
          record.type === "pdf_report" && record.generatedFilePath
            ? buildDownloadUrl(req, record.paymentReference)
            : ""
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/webhook", async (req, res, next) => {
  try {
    const signature = req.get("x-paystack-signature");
    if (!isValidPaystackWebhook(signature, req.rawBody)) {
      res.status(401).json({
        message: "Invalid webhook signature."
      });
      return;
    }

    const event = req.body;

    if (event?.event === "charge.success") {
      await markMonetizationFromWebhook(event.data);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
});

router.get("/download/:reference", async (req, res, next) => {
  const reference = typeof req.params.reference === "string" ? req.params.reference.trim() : "";

  if (!reference) {
    res.status(400).json({
      message: "Payment reference is required."
    });
    return;
  }

  try {
    if (!isDatabaseReady()) {
      res.status(503).json({
        message: "Database is not connected."
      });
      return;
    }

    const record = await MonetizationRequest.findOne({ paymentReference: reference });
    if (!record) {
      res.status(404).json({
        message: "Paid report not found."
      });
      return;
    }

    if (record.type !== "pdf_report") {
      res.status(400).json({
        message: "This payment does not have a downloadable PDF."
      });
      return;
    }

    if (record.paymentStatus !== "success") {
      res.status(402).json({
        message: "Payment has not been confirmed for this report yet."
      });
      return;
    }

    await ensurePaidReportGenerated(record);

    if (!record.generatedFilePath || !fs.existsSync(record.generatedFilePath)) {
      res.status(404).json({
        message: "The PDF report is not available yet."
      });
      return;
    }

    res.download(record.generatedFilePath, record.generatedFileName || `${reference}.pdf`);
  } catch (error) {
    next(error);
  }
});

export default router;

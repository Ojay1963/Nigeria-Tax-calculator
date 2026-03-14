import crypto from "crypto";
import { MonetizationRequest } from "../models/MonetizationRequest.js";
import { config } from "../config.js";
import { isDatabaseReady } from "./databaseService.js";
import { generatePaidPdfReport, hasGeneratedReport } from "./pdfReportService.js";
import { initializePaystackTransaction, isPaystackReady, verifyPaystackTransaction } from "./paystackService.js";

const MONETIZATION_CATALOG = {
  support_lead: {
    label: "Tax support lead",
    amount: 0
  },
  consultation: {
    label: "Tax consultation",
    amount: 20000
  },
  pdf_report: {
    label: "Reviewed PDF report",
    amount: 5000,
    variantAmounts: {
      "Reviewed PDF summary": 5000,
      "Branded management report": 15000,
      "Client-ready report pack": 25000
    }
  },
  subscription: {
    label: "Business subscription",
    amount: 25000,
    variantAmounts: {
      Business: 25000,
      "Pro Report": 5000,
      "Starter to Business migration": 25000
    }
  }
};

function getOfferAmount(payload) {
  const offer = MONETIZATION_CATALOG[payload.type];

  if (!offer) {
    throw new Error("Unsupported monetization type.");
  }

  if (payload.type === "pdf_report" && payload.reportScope) {
    return offer.variantAmounts?.[payload.reportScope] ?? offer.amount;
  }

  if (payload.type === "subscription" && payload.selectedPlan) {
    return offer.variantAmounts?.[payload.selectedPlan] ?? offer.amount;
  }

  return offer.amount;
}

function buildReference(type) {
  const slug = type.replace(/[^a-z]/gi, "").slice(0, 6).toUpperCase() || "NTC";
  return `NTC-${slug}-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export function getMonetizationPlans() {
  return [
    {
      id: "starter",
      name: "Starter",
      priceLabel: "Free",
      amount: 0,
      currency: "NGN",
      audience: "Individuals and one-off users",
      features: ["Calculator access", "Guide and FAQ", "Support lead capture"]
    },
    {
      id: "pro-report",
      name: "Pro Report",
      priceLabel: "From N5,000",
      amount: 5000,
      currency: "NGN",
      audience: "Users who need a branded PDF summary",
      features: ["Reviewed PDF summary", "Scenario notes", "Delivery follow-up"]
    },
    {
      id: "business",
      name: "Business",
      priceLabel: "From N25,000/month",
      amount: 25000,
      currency: "NGN",
      audience: "SMEs, HR teams, and finance users",
      features: ["Saved scenarios", "Priority support", "Team and workflow setup"]
    }
  ];
}

export async function ensurePaidReportGenerated(record) {
  if (!record || record.type !== "pdf_report" || record.paymentStatus !== "success") {
    return record;
  }

  if (await hasGeneratedReport(record)) {
    return record;
  }

  const generated = await generatePaidPdfReport(record);
  record.generatedFileName = generated.fileName;
  record.generatedFilePath = generated.filePath;
  record.generatedAt = new Date();
  await record.save();

  return record;
}

export async function createMonetizationRequest(payload, requestedByUserId = null) {
  if (!isDatabaseReady()) {
    throw new Error("Database is not connected.");
  }

  const amount = getOfferAmount(payload);
  const paymentRequired = amount > 0;

  return MonetizationRequest.create({
    ...payload,
    amount,
    currency: "NGN",
    paymentProvider: paymentRequired ? "paystack" : "",
    paymentStatus: paymentRequired ? "pending" : "not_required",
    requestedByUserId
  });
}

export async function initializeMonetizationCheckout(payload, requestedByUserId = null) {
  if (!isDatabaseReady()) {
    throw new Error("Database is not connected.");
  }

  if (!isPaystackReady()) {
    throw new Error("Paystack is not configured.");
  }

  const amount = getOfferAmount(payload);

  if (amount <= 0) {
    throw new Error("This request does not require payment.");
  }

  const reference = buildReference(payload.type);
  const callbackUrl = `${config.APP_BASE_URL}/payment/verify?reference=${encodeURIComponent(reference)}`;

  const record = await MonetizationRequest.create({
    ...payload,
    amount,
    currency: "NGN",
    paymentProvider: "paystack",
    paymentReference: reference,
    paymentStatus: "pending",
    requestedByUserId
  });

  try {
    const paystackTransaction = await initializePaystackTransaction({
      email: payload.email,
      amountInKobo: amount * 100,
      reference,
      callbackUrl,
      metadata: {
        monetizationRequestId: record._id.toString(),
        type: payload.type,
        amount,
        name: payload.name,
        companyName: payload.companyName || ""
      }
    });

    record.paymentAccessCode = paystackTransaction.access_code || "";
    record.paymentAuthorizationUrl = paystackTransaction.authorization_url || "";
    await record.save();

    return {
      record,
      authorizationUrl: paystackTransaction.authorization_url,
      accessCode: paystackTransaction.access_code,
      reference
    };
  } catch (error) {
    record.paymentStatus = "failed";
    await record.save();
    throw error;
  }
}

export async function verifyMonetizationPayment(reference) {
  if (!isDatabaseReady()) {
    throw new Error("Database is not connected.");
  }

  if (!isPaystackReady()) {
    throw new Error("Paystack is not configured.");
  }

  const record = await MonetizationRequest.findOne({ paymentReference: reference });
  if (!record) {
    throw new Error("Payment record not found.");
  }

  const verification = await verifyPaystackTransaction(reference);
  const wasSuccessful = verification.status === "success";

  record.lastPaymentVerification = new Date();
  record.paymentStatus = wasSuccessful ? "success" : "failed";

  if (wasSuccessful) {
    record.status = record.type === "consultation" ? "booked" : "paid";
    record.paidAt = verification.paid_at ? new Date(verification.paid_at) : new Date();
  }

  await record.save();
  await ensurePaidReportGenerated(record);

  return {
    record,
    verification
  };
}

export async function markMonetizationFromWebhook(eventData) {
  if (!isDatabaseReady()) {
    throw new Error("Database is not connected.");
  }

  const reference = eventData?.reference;
  if (!reference) {
    return null;
  }

  const record = await MonetizationRequest.findOne({ paymentReference: reference });
  if (!record) {
    return null;
  }

  record.lastPaymentVerification = new Date();

  if (eventData.status === "success") {
    record.paymentStatus = "success";
    record.status = record.type === "consultation" ? "booked" : "paid";
    record.paidAt = eventData.paid_at ? new Date(eventData.paid_at) : new Date();
  }

  await record.save();
  await ensurePaidReportGenerated(record);
  return record;
}

export async function listMonetizationRequests(limit = 50, type = "") {
  if (!isDatabaseReady()) {
    return [];
  }

  const filter = type ? { type } : {};

  return MonetizationRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

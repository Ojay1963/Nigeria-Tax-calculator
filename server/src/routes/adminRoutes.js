import express from "express";
import { z } from "zod";
import { requireDatabase } from "../middleware/databaseMiddleware.js";
import { CalculationRun } from "../models/CalculationRun.js";
import { MonetizationRequest } from "../models/MonetizationRequest.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { listContactMessages } from "../services/contactService.js";
import { listMonetizationRequests } from "../services/monetizationService.js";

const router = express.Router();
const limitSchema = z.coerce.number().int().min(1).max(200).default(50);

router.use(requireDatabase, requireAuth, requireRole("admin"));

router.get("/messages", async (req, res, next) => {
  try {
    const limit = limitSchema.parse(req.query.limit ?? 50);
    const messages = await listContactMessages(limit);
    res.json({
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

router.get("/calculations", async (req, res, next) => {
  try {
    const limit = limitSchema.parse(req.query.limit ?? 50);
    const calculations = await CalculationRun.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({
      count: calculations.length,
      data: calculations
    });
  } catch (error) {
    next(error);
  }
});

router.get("/monetization", async (req, res, next) => {
  try {
    const limit = limitSchema.parse(req.query.limit ?? 50);
    const type = typeof req.query.type === "string" ? req.query.type : "";
    const requests = await listMonetizationRequests(limit, type);
    res.json({
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
});

router.get("/dashboard", async (_req, res, next) => {
  try {
    const [messages, calculations, monetizationRequests] = await Promise.all([
      listContactMessages(200),
      CalculationRun.find({}).sort({ createdAt: -1 }).limit(200).lean(),
      MonetizationRequest.find({}).sort({ createdAt: -1 }).limit(200).lean()
    ]);

    const payeCount = calculations.filter(item => item.type === "paye").length;
    const companyCount = calculations.filter(item => item.type === "company").length;
    const supportLeadCount = monetizationRequests.filter(item => item.type === "support_lead").length;
    const consultationCount = monetizationRequests.filter(item => item.type === "consultation").length;
    const pdfReportCount = monetizationRequests.filter(item => item.type === "pdf_report").length;
    const subscriptionCount = monetizationRequests.filter(item => item.type === "subscription").length;

    res.json({
      messages: messages.length,
      calculations: calculations.length,
      payeCalculations: payeCount,
      companyCalculations: companyCount,
      monetizationRequests: monetizationRequests.length,
      supportLeads: supportLeadCount,
      consultations: consultationCount,
      pdfReports: pdfReportCount,
      subscriptionRequests: subscriptionCount
    });
  } catch (error) {
    next(error);
  }
});

export default router;

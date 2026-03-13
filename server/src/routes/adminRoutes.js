import express from "express";
import { z } from "zod";
import { requireDatabase } from "../middleware/databaseMiddleware.js";
import { CalculationRun } from "../models/CalculationRun.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { listContactMessages } from "../services/contactService.js";

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

router.get("/dashboard", async (_req, res, next) => {
  try {
    const [messages, calculations] = await Promise.all([
      listContactMessages(200),
      CalculationRun.find({}).sort({ createdAt: -1 }).limit(200).lean()
    ]);

    const payeCount = calculations.filter(item => item.type === "paye").length;
    const companyCount = calculations.filter(item => item.type === "company").length;

    res.json({
      messages: messages.length,
      calculations: calculations.length,
      payeCalculations: payeCount,
      companyCalculations: companyCount
    });
  } catch (error) {
    next(error);
  }
});

export default router;

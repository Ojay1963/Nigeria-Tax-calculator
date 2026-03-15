import express from "express";
import { CalculationRun } from "../models/CalculationRun.js";
import { requireDatabase } from "../middleware/databaseMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { listContactMessagesForUser } from "../services/contactService.js";
import { listMonetizationRequestsForUser } from "../services/monetizationService.js";

const router = express.Router();

function buildDownloadUrl(req, reference) {
  return `${req.protocol}://${req.get("host")}/api/monetization/download/${encodeURIComponent(reference)}`;
}

router.use(requireDatabase, requireAuth);

router.get("/dashboard", async (req, res, next) => {
  try {
    const [calculations, messages, monetization] = await Promise.all([
      CalculationRun.find({ requestedByUserId: req.user._id }).sort({ createdAt: -1 }).limit(12).lean(),
      listContactMessagesForUser(req.user._id, req.user.email, 12),
      listMonetizationRequestsForUser(req.user._id, req.user.email, 20)
    ]);

    const paidReports = monetization
      .filter(item => item.type === "pdf_report" && item.paymentStatus === "success")
      .map(item => ({
        ...item,
        downloadUrl: item.generatedFilePath ? buildDownloadUrl(req, item.paymentReference) : ""
      }));

    const consultations = monetization.filter(item => item.type === "consultation");
    const supportRequests = monetization.filter(item => item.type === "support_lead");
    const subscriptions = monetization.filter(item => item.type === "subscription");

    res.json({
      stats: {
        calculations: calculations.length,
        paidReports: paidReports.length,
        consultations: consultations.length,
        supportRequests: supportRequests.length,
        subscriptions: subscriptions.length,
        messages: messages.length
      },
      calculations,
      messages,
      monetization,
      paidReports,
      consultations,
      supportRequests,
      subscriptions
    });
  } catch (error) {
    next(error);
  }
});

export default router;

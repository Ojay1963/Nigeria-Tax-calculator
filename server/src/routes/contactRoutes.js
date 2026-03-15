import express from "express";
import { z } from "zod";
import { requireDatabase } from "../middleware/databaseMiddleware.js";
import { optionalAuth, requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { listContactMessages, saveContactMessage } from "../services/contactService.js";

const router = express.Router();

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  audience: z.string().trim().min(2),
  message: z.string().trim().min(10)
});

router.use(requireDatabase);
router.use(optionalAuth);

router.post("/", async (req, res, next) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please fill the contact form with valid details.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const submittedByUserId = req.user?._id || null;
    await saveContactMessage(parsed.data, submittedByUserId);
    res.status(201).json({
      message: "Message received. It has been saved on the server for follow-up."
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const messages = await listContactMessages(50);
    res.json({
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

export default router;

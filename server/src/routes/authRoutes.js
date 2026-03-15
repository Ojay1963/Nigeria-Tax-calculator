import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireDatabase } from "../middleware/databaseMiddleware.js";
import {
  getUserById,
  loginUser,
  requestPasswordReset,
  registerUser,
  resetPassword,
  resendVerification,
  verifyUserEmail
} from "../services/authService.js";

const router = express.Router();

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

const verificationSchema = z.object({
  token: z.string().min(20)
});

const resendSchema = z.object({
  email: z.string().trim().email()
});

const passwordResetRequestSchema = z.object({
  email: z.string().trim().email()
});

const passwordResetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

router.use(requireDatabase);

router.post("/register", async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide valid registration details.",
      issues: parsed.error.flatten()
    });
    return;
  }

  try {
    const user = await registerUser(parsed.data);
    res.status(201).json({
      message: "Account created. Please check your email to verify your account.",
      data: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/verify-email", async (req, res, next) => {
  const parsed = verificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "A valid verification token is required."
    });
    return;
  }

  try {
    const user = await verifyUserEmail(parsed.data.token);
    res.json({
      message: "Email verified successfully.",
      data: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/resend-verification", async (req, res, next) => {
  const parsed = resendSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "A valid email address is required."
    });
    return;
  }

  try {
    await resendVerification(parsed.data.email);
    res.json({
      message: "Verification email sent."
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide a valid email and password."
    });
    return;
  }

  try {
    const { user, token } = await loginUser(parsed.data);
    res.json({
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  const parsed = passwordResetRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "A valid email address is required."
    });
    return;
  }

  try {
    await requestPasswordReset(parsed.data.email);
    res.json({
      message: "If an account exists for that email, a password reset link has been sent."
    });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  const parsed = passwordResetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please provide a valid reset token and a password with at least 8 characters."
    });
    return;
  }

  try {
    await resetPassword(parsed.data);
    res.json({
      message: "Password reset successful. You can now log in with your new password."
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    res.json({
      data: user
    });
  } catch (error) {
    next(error);
  }
});

export default router;

import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../models/User.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./emailService.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return {
    rawToken,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };
}

function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return {
    rawToken,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000)
  };
}

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN
    }
  );
}

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verification = createVerificationToken();

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    verificationTokenHash: verification.tokenHash,
    verificationTokenExpiresAt: verification.expiresAt
  });

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token: verification.rawToken
  });

  return user;
}

export async function verifyUserEmail(token) {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    verificationTokenHash: tokenHash,
    verificationTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw new Error("Verification link is invalid or expired.");
  }

  user.isVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();

  return user;
}

export async function resendVerification(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("No account was found for that email.");
  }

  if (user.isVerified) {
    throw new Error("This account is already verified.");
  }

  const verification = createVerificationToken();
  user.verificationTokenHash = verification.tokenHash;
  user.verificationTokenExpiresAt = verification.expiresAt;
  await user.save();

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token: verification.rawToken
  });

  return user;
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return;
  }

  const reset = createPasswordResetToken();
  user.passwordResetTokenHash = reset.tokenHash;
  user.passwordResetTokenExpiresAt = reset.expiresAt;
  await user.save();

  await sendPasswordResetEmail({
    email: user.email,
    name: user.name,
    token: reset.rawToken
  });
}

export async function resetPassword({ token, password }) {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetTokenExpiresAt: { $gt: new Date() }
  });

  if (!user) {
    throw new Error("Password reset link is invalid or expired.");
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  await user.save();

  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user,
    token: signAccessToken(user)
  };
}

export async function getUserById(userId) {
  return User.findById(userId).select(
    "-passwordHash -verificationTokenHash -passwordResetTokenHash"
  );
}

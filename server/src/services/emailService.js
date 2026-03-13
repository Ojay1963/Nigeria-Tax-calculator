import nodemailer from "nodemailer";
import { config } from "../config.js";

let transporter;
let hasLoggedSkip = false;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth:
        config.SMTP_USER && config.SMTP_PASS
          ? {
              user: config.SMTP_USER,
              pass: config.SMTP_PASS
            }
          : undefined
    });
  }

  return transporter;
}

export function isEmailReady() {
  return config.isEmailConfigured;
}

export async function sendVerificationEmail({ email, name, token }) {
  if (!config.isEmailConfigured) {
    if (!hasLoggedSkip) {
      console.warn("SMTP credentials are not configured. Verification email was skipped.");
      hasLoggedSkip = true;
    }
    return;
  }

  const verificationUrl = `${config.APP_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;

  await getTransporter().sendMail({
    from: `"${config.SMTP_FROM_NAME}" <${config.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Verify your Naija Tax Calculator account",
    text: `Hello ${name}, verify your account by opening this link: ${verificationUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your Naija Tax Calculator account</h2>
        <p>Hello ${name},</p>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      </div>
    `
  });
}

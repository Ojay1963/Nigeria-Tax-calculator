import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  ALLOWED_ORIGINS: z.string().default(""),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ADMIN_TOKEN: z.string().default(""),
  MONGODB_URI: z.string().default(""),
  JWT_SECRET: z.string().default("development-jwt-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  APP_BASE_URL: z.string().url().default("http://localhost:5173"),
  SMTP_HOST: z.string().default("smtp-relay.brevo.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM_EMAIL: z.string().email().default("noreply@example.com"),
  SMTP_FROM_NAME: z.string().default("Naija Tax Calculator"),
  PAYSTACK_SECRET_KEY: z.string().default(""),
  PAYSTACK_PUBLIC_KEY: z.string().default("")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

function isLikelyPlaceholderSecret(secret) {
  return secret.length < 32 || secret.includes("change-me") || secret.includes("replace-with");
}

if (parsed.data.NODE_ENV === "production") {
  const productionErrors = [];

  if (!parsed.data.MONGODB_URI) {
    productionErrors.push("MONGODB_URI is required in production.");
  }

  if (isLikelyPlaceholderSecret(parsed.data.JWT_SECRET)) {
    productionErrors.push("JWT_SECRET must be at least 32 characters and not a placeholder in production.");
  }

  if (!parsed.data.ALLOWED_ORIGINS.trim()) {
    productionErrors.push("ALLOWED_ORIGINS must contain at least one allowed origin in production.");
  }

  if (!parsed.data.APP_BASE_URL.startsWith("https://")) {
    productionErrors.push("APP_BASE_URL must use https in production.");
  }

  if ((parsed.data.SMTP_USER && !parsed.data.SMTP_PASS) || (!parsed.data.SMTP_USER && parsed.data.SMTP_PASS)) {
    productionErrors.push("SMTP_USER and SMTP_PASS must both be set together.");
  }

  if (!parsed.data.PAYSTACK_SECRET_KEY) {
    productionErrors.push("PAYSTACK_SECRET_KEY is required in production.");
  }

  if (productionErrors.length > 0) {
    console.error("Invalid production environment configuration", productionErrors);
    process.exit(1);
  }
}

export const config = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test",
  isEmailConfigured: Boolean(parsed.data.SMTP_USER && parsed.data.SMTP_PASS),
  isPaystackConfigured: Boolean(parsed.data.PAYSTACK_SECRET_KEY),
  allowedOrigins: parsed.data.ALLOWED_ORIGINS
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)
};

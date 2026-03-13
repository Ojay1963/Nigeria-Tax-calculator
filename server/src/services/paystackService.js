import crypto from "crypto";
import { config } from "../config.js";

const PAYSTACK_API_BASE_URL = "https://api.paystack.co";

function getHeaders() {
  if (!config.PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack is not configured.");
  }

  return {
    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json"
  };
}

async function paystackRequest(path, options = {}) {
  const response = await fetch(`${PAYSTACK_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    throw new Error(data.message || "Paystack request failed.");
  }

  return data.data;
}

export function isPaystackReady() {
  return Boolean(config.PAYSTACK_SECRET_KEY);
}

export async function initializePaystackTransaction({
  email,
  amountInKobo,
  reference,
  callbackUrl,
  metadata
}) {
  return paystackRequest("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      callback_url: callbackUrl,
      currency: "NGN",
      metadata
    })
  });
}

export async function verifyPaystackTransaction(reference) {
  return paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
}

export function isValidPaystackWebhook(signature, rawBody) {
  if (!config.PAYSTACK_SECRET_KEY || !signature || !rawBody) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha512", config.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(provided, expected);
}

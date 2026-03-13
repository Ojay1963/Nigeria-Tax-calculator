import { MonetizationRequest } from "../models/MonetizationRequest.js";
import { isDatabaseReady } from "./databaseService.js";

export async function createMonetizationRequest(payload, requestedByUserId = null) {
  if (!isDatabaseReady()) {
    throw new Error("Database is not connected.");
  }

  return MonetizationRequest.create({
    ...payload,
    requestedByUserId
  });
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

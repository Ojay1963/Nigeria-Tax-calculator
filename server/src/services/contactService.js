import { ContactMessage } from "../models/ContactMessage.js";
import { isDatabaseReady } from "./databaseService.js";

export async function saveContactMessage(payload, submittedByUserId = null) {
  if (!isDatabaseReady()) {
    throw new Error("Database is not connected.");
  }

  return ContactMessage.create({
    ...payload,
    submittedByUserId
  });
}

export async function listContactMessages(limit = 50) {
  if (!isDatabaseReady()) {
    return [];
  }

  return ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

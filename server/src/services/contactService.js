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

export async function listContactMessagesForUser(userId, email, limit = 20) {
  if (!isDatabaseReady()) {
    return [];
  }

  const filters = [];

  if (userId) {
    filters.push({ submittedByUserId: userId });
  }

  if (email) {
    filters.push({ email: email.toLowerCase() });
  }

  if (filters.length === 0) {
    return [];
  }

  return ContactMessage.find({ $or: filters })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

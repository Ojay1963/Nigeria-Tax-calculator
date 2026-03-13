import mongoose from "mongoose";
import { config } from "../config.js";

let hasLoggedSkip = false;
mongoose.set("bufferCommands", false);

export async function connectToDatabase() {
  if (!config.MONGODB_URI) {
    if (!hasLoggedSkip) {
      console.warn("MONGODB_URI is not set. Database-backed features will be unavailable.");
      hasLoggedSkip = true;
    }
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  await mongoose.connect(config.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });

  return true;
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

import mongoose from "mongoose";
import { config } from "../config.js";

let hasLoggedSkip = false;
mongoose.set("bufferCommands", false);

export async function connectToDatabase() {
  if (!config.MONGODB_URI) {
    if (!hasLoggedSkip) {
      console.warn(
        `Database-backed features will be unavailable. Missing env key(s): ${config.missingIntegrationKeys.database.join(", ")}.`
      );
      hasLoggedSkip = true;
    }
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  await mongoose.connect(config.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: !config.isProduction
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

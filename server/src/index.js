import app from "./app.js";
import { config } from "./config.js";
import { connectToDatabase, disconnectDatabase } from "./services/databaseService.js";

await connectToDatabase().catch(error => {
  console.error("Failed to connect to MongoDB", error);
  if (config.isProduction) {
    process.exit(1);
  }
});

const server = app.listen(config.PORT, () => {
  console.log(`Naija Tax Calculator API listening on port ${config.PORT}`);
  if (!config.MONGODB_URI) {
    console.warn(
      `MongoDB is not configured. Auth, contact, admin, and monetization features will return 503. Missing env key(s): ${config.missingIntegrationKeys.database.join(", ")}.`
    );
  }
  if (!config.isEmailConfigured) {
    console.warn(
      `SMTP is not fully configured. Verification emails will be skipped. Missing env key(s): ${config.missingIntegrationKeys.email.join(", ")}.`
    );
  }
  if (!config.isPaystackConfigured) {
    console.warn(
      `Paystack is not fully configured. Paid checkout flows will be unavailable. Missing env key(s): ${config.missingIntegrationKeys.paystack.join(", ")}.`
    );
  }
});

function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);
  server.close(() => {
    disconnectDatabase()
      .catch(error => {
        console.error("Failed to close MongoDB connection", error);
      })
      .finally(() => process.exit(0));
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

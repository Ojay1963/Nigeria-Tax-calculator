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
  console.log(`Tax Tools NG API listening on http://localhost:${config.PORT}`);
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

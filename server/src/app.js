import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import { config } from "./config.js";
import { isDatabaseReady } from "./services/databaseService.js";
import { isEmailReady } from "./services/emailService.js";
import { isPaystackReady } from "./services/paystackService.js";
import contactRoutes from "./routes/contactRoutes.js";
import monetizationRoutes from "./routes/monetizationRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP. Please try again later."
  }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many contact requests from this IP. Please try again later."
  }
});

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        !config.isProduction ||
        config.allowedOrigins.length === 0 ||
        config.allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(
  express.json({
    limit: "250kb",
    verify(req, _res, buf) {
      req.rawBody = buf.toString("utf8");
    }
  })
);
app.use(express.urlencoded({ extended: false, limit: "250kb" }));
app.use(
  morgan(config.isProduction ? "combined" : "dev", {
    skip: req => config.isTest && req.path === "/api/health"
  })
);
app.use("/api", apiLimiter);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "naija-tax-calculator-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/ready", (_req, res) => {
  const databaseReady = isDatabaseReady() || !config.MONGODB_URI;
  const ready = databaseReady;

  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "degraded",
    database: isDatabaseReady() ? "connected" : config.MONGODB_URI ? "disconnected" : "not-configured",
    email: isEmailReady() ? "configured" : "not-configured",
    paystack: isPaystackReady() ? "configured" : "not-configured"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/monetization", monetizationRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({
    message: "API route not found."
  });
});

if (config.isProduction) {
  app.use(
    express.static(clientDistPath, {
      maxAge: "1h",
      index: false
    })
  );

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Unexpected server error.";
  const status =
    message.includes("Database is not connected")
      ? 503
      : message.includes("Paystack is not configured")
        ? 503
      : message.includes("Origin not allowed")
        ? 403
      : message.includes("already exists") ||
          message.includes("Verification") ||
          message.includes("Invalid email or password") ||
          message.includes("Please verify")
        ? 400
        : 500;

  res.status(status).json({
    message: status === 500 && config.isProduction ? "Internal server error." : message
  });
});

export default app;

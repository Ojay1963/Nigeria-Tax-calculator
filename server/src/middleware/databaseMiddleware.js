import { isDatabaseReady } from "../services/databaseService.js";

export function requireDatabase(req, res, next) {
  if (!isDatabaseReady()) {
    res.status(503).json({
      message: "Database is not connected."
    });
    return;
  }

  next();
}

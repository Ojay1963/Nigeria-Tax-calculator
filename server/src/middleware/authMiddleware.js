import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { getUserById } from "../services/authService.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authentication required."
      });
      return;
    }

    const token = authHeader.slice("Bearer ".length);
    const payload = jwt.verify(token, config.JWT_SECRET);
    const user = await getUserById(payload.sub);

    if (!user) {
      res.status(401).json({
        message: "User account no longer exists."
      });
      return;
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.slice("Bearer ".length);
    const payload = jwt.verify(token, config.JWT_SECRET);
    const user = await getUserById(payload.sub);

    if (user) {
      req.user = user;
    }
  } catch (_error) {
    req.user = undefined;
  }

  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: "You do not have permission to perform this action."
      });
      return;
    }

    next();
  };
}

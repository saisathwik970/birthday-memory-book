import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies JWT from httpOnly cookie (or Authorization header as fallback)
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.[process.env.COOKIE_NAME || "bmb_token"];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.status !== "approved") {
      return res.status(403).json({ message: "Account not yet approved" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Restricts a route to specific roles, e.g. requireRole("admin")
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

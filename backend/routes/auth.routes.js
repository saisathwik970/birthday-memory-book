import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
});

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(process.env.COOKIE_NAME || "bmb_token", token, {
    httpOnly: true,
    secure: isProd, // requires HTTPS — true on Render/Vercel, false on localhost
    sameSite: isProd ? "none" : "lax", // "none" needed when frontend/backend are different domains
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// @route  POST /api/auth/register
// @desc   Register a new member (requires admin approval before login works)
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username").trim().isLength({ min: 3 }).withMessage("Username too short"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { name, username, password } = req.body;
      const existing = await User.findOne({ username: username.toLowerCase() });
      if (existing) {
        return res.status(409).json({ message: "Username already taken" });
      }

      const user = await User.create({
        name,
        username: username.toLowerCase(),
        password,
        role: "member",
        status: "pending",
      });

      res.status(201).json({
        message: "Registration submitted. An admin must approve your account before you can log in.",
        user: user.toSafeObject(),
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route  POST /api/auth/login
router.post(
  "/login",
  loginLimiter,
  [body("username").trim().notEmpty(), body("password").notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const { username, password } = req.body;
      const user = await User.findOne({ username: username.toLowerCase() });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      if (user.status !== "approved") {
        return res.status(403).json({
          message:
            user.status === "pending"
              ? "Your account is awaiting admin approval."
              : "Your account was not approved.",
        });
      }

      const token = signToken(user._id);
      sendTokenCookie(res, token);

      res.json({ message: "Login successful", user: user.toSafeObject(), token });
    } catch (err) {
      next(err);
    }
  }
);

// @route  POST /api/auth/logout
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(process.env.COOKIE_NAME || "bmb_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.json({ message: "Logged out" });
});

// @route  GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
});

export default router;
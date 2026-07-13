import express from "express";
import Settings from "../models/Settings.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public-ish (any logged in user) - fetch site settings / final surprise content
router.get("/", protect, async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: "site" });
    if (!settings) {
      settings = await Settings.create({ key: "site" });
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

router.put("/", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate({ key: "site" }, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

export default router;

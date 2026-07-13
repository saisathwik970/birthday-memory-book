import express from "express";
import { body, validationResult } from "express-validator";
import Guestbook from "../models/Guestbook.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const entries = await Guestbook.find().sort({ createdAt: -1 }).populate("author", "name username");
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  protect,
  [body("message").trim().isLength({ min: 1, max: 500 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "A message is required (max 500 chars)" });
      }

      const entry = await Guestbook.create({
        author: req.user._id,
        name: req.user.name,
        message: req.body.message,
        emoji: req.body.emoji || "🎉",
      });

      res.status(201).json(entry);
    } catch (err) {
      next(err);
    }
  }
);

// Toggle heart reaction
router.post("/:id/heart", protect, async (req, res, next) => {
  try {
    const entry = await Guestbook.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const uid = req.user._id.toString();
    const already = entry.heartedBy.some((id) => id.toString() === uid);

    if (already) {
      entry.heartedBy = entry.heartedBy.filter((id) => id.toString() !== uid);
      entry.hearts = Math.max(0, entry.hearts - 1);
    } else {
      entry.heartedBy.push(req.user._id);
      entry.hearts += 1;
    }

    await entry.save();
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

// Admin can remove inappropriate entries
router.delete("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const entry = await Guestbook.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

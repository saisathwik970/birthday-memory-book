import express from "express";
import Timeline from "../models/Timeline.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const items = await Timeline.find().sort({ order: 1, year: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Timeline.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Timeline.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Timeline entry not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Timeline.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Timeline entry not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

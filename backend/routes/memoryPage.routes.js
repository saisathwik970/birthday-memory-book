import express from "express";
import MemoryPage from "../models/MemoryPage.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const pages = await MemoryPage.find().sort({ pageNumber: 1 });
    res.json(pages);
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const page = await MemoryPage.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const page = await MemoryPage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const page = await MemoryPage.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

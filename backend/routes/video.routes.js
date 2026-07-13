import express from "express";
import Video from "../models/Video.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadVideo } from "../config/cloudinary.js";

const router = express.Router();

// @route  GET /api/videos
router.get("/", protect, async (req, res, next) => {
  try {
    const items = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/videos  (admin only)
router.post("/", protect, requireRole("admin"), uploadVideo.single("video"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Video file is required" });

    const item = await Video.create({
      title: req.body.title || "Untitled",
      caption: req.body.caption || "",
      videoUrl: req.file.path,
      cloudinaryId: req.file.filename,
      thumbnail: req.body.thumbnail || "",
      order: Number(req.body.order) || 0,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/videos/:id  (admin only)
router.put("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Video not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/videos/:id  (admin only)
router.delete("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Video.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

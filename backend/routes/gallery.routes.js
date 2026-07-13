import express from "express";
import Gallery from "../models/Gallery.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadImage } from "../config/cloudinary.js";

const router = express.Router();

// @route  GET /api/gallery
router.get("/", protect, async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/gallery  (admin only)
router.post("/", protect, requireRole("admin"), uploadImage.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    const item = await Gallery.create({
      title: req.body.title || "Untitled",
      caption: req.body.caption || "",
      tags: req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [],
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      order: Number(req.body.order) || 0,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/gallery/:id  (admin only) - edit caption/title/order
router.put("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/gallery/reorder/bulk  (admin only) - drag & drop reorder
router.put("/reorder/bulk", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // array of gallery _ids in new order
    await Promise.all(
      orderedIds.map((id, index) => Gallery.findByIdAndUpdate(id, { order: index }))
    );
    res.json({ message: "Order updated" });
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/gallery/:id  (admin only)
router.delete("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/gallery/:id/favorite  (member) - toggle favorite
router.post("/:id/favorite", protect, async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    const uid = req.user._id.toString();
    const already = item.favoritedBy.some((id) => id.toString() === uid);

    if (already) {
      item.favoritedBy = item.favoritedBy.filter((id) => id.toString() !== uid);
      item.likes = Math.max(0, item.likes - 1);
    } else {
      item.favoritedBy.push(req.user._id);
      item.likes += 1;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;

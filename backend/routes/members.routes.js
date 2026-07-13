import express from "express";
import User from "../models/User.js";
import Gallery from "../models/Gallery.js";
import Video from "../models/Video.js";
import Guestbook from "../models/Guestbook.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/members  (admin only) - list all members
router.get("/", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const members = await User.find({ role: "member" }).select("-password").sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/members/:id/approve  (admin only)
router.put("/:id/approve", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).select("-password");
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/members/:id/reject  (admin only)
router.put("/:id/reject", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).select("-password");
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/members/:id  (admin only)
router.delete("/:id", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const member = await User.findOneAndDelete({ _id: req.params.id, role: "member" });
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member removed" });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/members/stats  (admin only) - dashboard stats
router.get("/stats/overview", protect, requireRole("admin"), async (req, res, next) => {
  try {
    const [totalMembers, pendingMembers, totalPhotos, totalVideos, totalWishes] = await Promise.all([
      User.countDocuments({ role: "member", status: "approved" }),
      User.countDocuments({ role: "member", status: "pending" }),
      Gallery.countDocuments(),
      Video.countDocuments(),
      Guestbook.countDocuments(),
    ]);
    res.json({ totalMembers, pendingMembers, totalPhotos, totalVideos, totalWishes });
  } catch (err) {
    next(err);
  }
});

export default router;

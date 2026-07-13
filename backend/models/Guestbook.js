import mongoose from "mongoose";

const guestbookSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    emoji: { type: String, default: "🎉" },
    hearts: { type: Number, default: 0 },
    heartedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Guestbook", guestbookSchema);

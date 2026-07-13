import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String },
    caption: { type: String, default: "" },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);

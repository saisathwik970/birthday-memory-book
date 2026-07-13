import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    photos: [{ type: String }],
    videos: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Timeline", timelineSchema);

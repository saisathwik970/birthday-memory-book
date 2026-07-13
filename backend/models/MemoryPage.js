import mongoose from "mongoose";

const memoryPageSchema = new mongoose.Schema(
  {
    pageNumber: { type: Number, required: true },
    photoUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    caption: { type: String, default: "" },
    date: { type: String, default: "" },
    sticker: { type: String, default: "" },
    decoration: { type: String, default: "tape" }, // tape | flowers | none
  },
  { timestamps: true }
);

export default mongoose.model("MemoryPage", memoryPageSchema);

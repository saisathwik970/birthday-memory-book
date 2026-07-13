import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    siteTitle: { type: String, default: "Happy Birthday ❤️" },
    subtitle: { type: String, default: "Every memory tells a story." },
    musicUrl: { type: String, default: "" },
    finalMessage: { type: String, default: "" },
    finalVideoUrl: { type: String, default: "" },
    finalPhotos: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);

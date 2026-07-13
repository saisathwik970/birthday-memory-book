import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Load environment variables here too. ES module imports are all evaluated before
// server.js's own top-level code runs, so relying solely on server.js's dotenv.config()
// means process.env.CLOUDINARY_* can still be undefined at the moment this file's
// cloudinary.config() call below executes. Calling dotenv.config() again here is safe
// (it's a no-op if already loaded) and guarantees the credentials are always present.
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "birthday-memory-book/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "birthday-memory-book/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

export default cloudinary;
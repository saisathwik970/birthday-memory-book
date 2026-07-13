import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import videoRoutes from "./routes/video.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import guestbookRoutes from "./routes/guestbook.routes.js";
import memoryPageRoutes from "./routes/memoryPage.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import membersRoutes from "./routes/members.routes.js";

dotenv.config();

const app = express();

// --- Security & core middleware ---
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use("/api", globalLimiter);

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/guestbook", guestbookRoutes);
app.use("/api/memory-pages", memoryPageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/members", membersRoutes);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();

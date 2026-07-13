import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const { ADMIN_NAME, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  const existing = await User.findOne({ username: ADMIN_USERNAME.toLowerCase() });
  if (existing) {
    console.log(`Admin "${ADMIN_USERNAME}" already exists. Skipping.`);
    process.exit(0);
  }

  const admin = await User.create({
    name: ADMIN_NAME || "Admin",
    username: ADMIN_USERNAME.toLowerCase(),
    password: ADMIN_PASSWORD,
    role: "admin",
    status: "approved",
  });

  console.log(`Admin created: ${admin.username}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

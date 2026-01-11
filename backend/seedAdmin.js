import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // Use 'bcryptjs' to match controller
import Admin from "./models/Admin.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const seedAdmin = async () => {
  try {
    // --- NEW: FORCE DELETE OLD ADMINS ---
    // This ensures we get rid of any bad entries.
    const deleted1 = await Admin.deleteOne({ username: "admin" });
    if (deleted1.deletedCount > 0) {
      console.log("Found and deleted old 'admin' user.");
    }

    // Delete other bad entries you showed me from your database
    const deleted2 = await Admin.deleteOne({ username: "SuperAdmin" });
    if (deleted2.deletedCount > 0) {
      console.log("Found and deleted old 'SuperAdmin' user.");
    }

    const deleted3 = await Admin.deleteOne({ email: "admin@gmail.com" });
    if (deleted3.deletedCount > 0) {
      console.log("Found and deleted old 'admin@gmail.com' user.");
    }

    // --- NOW, CREATE THE NEW, CORRECT ADMIN ---
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      email: "admin@rktfitvibe.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin 'admin' created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();


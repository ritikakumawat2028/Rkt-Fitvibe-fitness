import Admin from "../models/Admin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; 
import Trainer from "../models/Trainer.js";

// --- Admin Login ---
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Wrong credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong credentials" });

    const ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || "dev_admin_secret";
    if (!process.env.JWT_ADMIN_SECRET) {
        console.warn("WARNING: JWT_ADMIN_SECRET not set. Using a development fallback secret.");
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      ADMIN_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- List Users ---
export const listUsers = async (req, res) => {
   try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const q = req.query.q
      ? {
          $or: [
            { name: new RegExp(req.query.q, "i") },
            { email: new RegExp(req.query.q, "i") },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(q)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(q),
    ]);

    res.json({
        users,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("List Users Error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// --- Get Single User ---
export const getUser = async (req, res) => {
   try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Server error fetching user" });
  }
};

// --- Delete User ---
export const deleteUser = async (req, res) => {
   try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
     if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Server error deleting user" });
  }
};

// --- Update User ---
export const updateUser = async (req, res) => {
   try {
    const updates = req.body;

    if (updates.password && updates.password.trim() !== "") {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Update User Error:", err);
     if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "Server error updating user" });
  }
};

// --- Return flat list for admin tables ---
export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("getAllUsers Error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// --- UPDATED: Get Dashboard Stats ---
export const getDashboardStats = async (_req, res) => {
  try {
    // Aggregations in parallel
    const [userCount, adminCount, trainerCount, dbStats, collections, recentUsers, plansAgg] = await Promise.all([
      User.countDocuments(),
      Admin.countDocuments(),
      Trainer.countDocuments(),
      mongoose.connection.db.stats(),
      mongoose.connection.db.listCollections().toArray(),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt"),
      User.aggregate([
        { $match: { plan: { $exists: true, $ne: null, $ne: "" } } },
        { $group: { _id: "$plan" } },
        { $count: "count" }
      ]),
    ]);

    const totalRecords = userCount + adminCount + trainerCount;
    const collectionCount = collections.length;
    const databaseSize = dbStats.storageSize || 0;
    const distinctPlans = Array.isArray(plansAgg) && plansAgg.length > 0 ? plansAgg[0].count : 0;

    res.json({
      totalUsers: userCount,
      totalAdmins: adminCount,
      totalTrainers: trainerCount,
      totalRecords,
      databaseSize,
      collectionCount,
      distinctPlans,
      recentUsers,
    });
  } catch (err) {
    console.error("Get Dashboard Stats Error:", err);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};

import express from "express";
import { adminLogin, getAllUsers, getUser as getUserById, deleteUser as deleteUserById, updateUser as updateUserById, getDashboardStats } from "../controllers/adminController.js";
import { listTrainersAdmin, createTrainerAdmin, updateTrainerAdmin, deleteTrainerAdmin } from "../controllers/trainerAdminController.js";
import adminAuth from "../middleware/adminAuth.js";
import User from "../models/User.js";

const router = express.Router();

// Auth
router.post("/login", adminLogin);

// Users management
router.get("/users", adminAuth, getAllUsers);
router.get("/users/:id", adminAuth, getUserById);
router.delete("/users/:id", adminAuth, deleteUserById);
router.put("/users/:id", adminAuth, updateUserById);

// Trainers management
router.get("/trainers", adminAuth, listTrainersAdmin);
router.post("/trainers", adminAuth, createTrainerAdmin);
router.put("/trainers/:id", adminAuth, updateTrainerAdmin);
router.delete("/trainers/:id", adminAuth, deleteTrainerAdmin);

// Dashboard stats
router.get("/dashboard/stats", adminAuth, getDashboardStats);

// Recent activity (simple: 5 most recent users)
router.get("/activity/recent-users", adminAuth, async (_req, res) => {
  try {
    const recent = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt");
    res.json(recent);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

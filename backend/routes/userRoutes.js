// backend/routes/userRoutes.js
import express from "express";
import { userAuth } from "../middleware/userAuth.js"; // User authentication middleware
import { getUserProfile, getUserDashboard } from "../controllers/userController.js"; // User controller functions
import { enrollProgram, getEnrollment, completeWorkout, getWeeklyProgress, listPlans, listTrainers } from "../controllers/enrollmentController.js";

const router = express.Router();

// @desc    Get logged-in user profile
// @route   GET /api/users/me
// @access  Private (User only)
router.get("/me", userAuth, getUserProfile);

// @desc    Get logged-in user dashboard data
// @route   GET /api/users/me/dashboard
// @access  Private (User only)
router.get("/me/dashboard", userAuth, getUserDashboard);

// Enrollment & workouts
router.post("/enroll", userAuth, enrollProgram);
router.get("/enrollment", userAuth, getEnrollment);
router.post("/workouts/complete", userAuth, completeWorkout);
router.get("/me/weekly", userAuth, getWeeklyProgress);

// Catalog
router.get("/plans", userAuth, listPlans);
router.get("/trainers", userAuth, listTrainers);

export default router;

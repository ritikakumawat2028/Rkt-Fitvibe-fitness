import Enrollment from "../models/Enrollment.js";
import Trainer from "../models/Trainer.js";

// In-app catalog (could be persisted later)
const PLANS = [
  { name: "Strength Training", description: "Build muscle and strength", price: 2999 },
  { name: "Yoga & Flexibility", description: "Mobility and mindfulness", price: 1999 },
  { name: "HIIT Training", description: "Intervals for fat loss", price: 2499 },
];

const defaultTrainers = [
  { name: "Rajesh Kumar", specialty: "Strength Training", rate: "₹1,500/hr", rating: 4.9, experience: "8 years" },
  { name: "Priya Sharma", specialty: "Yoga & Flexibility", rate: "₹1,200/hr", rating: 4.8, experience: "6 years" },
  { name: "Vikram Rao", specialty: "HIIT", rate: "₹1,400/hr", rating: 4.7, experience: "7 years" },
];

// Generate workouts based on plan name
const workoutsFor = (planName) => {
  switch (planName) {
    case "Strength Training":
      return [
        { title: "Upper Body Workout", duration: 60, calories: 400, completed: false },
        { title: "Lower Body Strength", duration: 60, calories: 350, completed: false },
      ];
    case "Yoga & Flexibility":
      return [
        { title: "Morning Yoga", duration: 60, calories: 200, completed: false },
        { title: "Evening Flexibility", duration: 45, calories: 150, completed: false },
      ];
    case "HIIT Training":
      return [
        { title: "HIIT Cardio", duration: 30, calories: 300, completed: false },
        { title: "HIIT Core", duration: 30, calories: 250, completed: false },
      ];
    default:
      return [];
  }
};

export const listPlans = async (_req, res) => {
  res.json(PLANS);
};

export const listTrainers = async (_req, res) => {
  const count = await Trainer.countDocuments();
  if (count === 0) {
    await Trainer.insertMany(defaultTrainers);
  }
  const trainers = await Trainer.find().sort({ name: 1 });
  res.json(trainers);
};

export const enrollProgram = async (req, res) => {
  const userId = req.user._id;
  const { planName, trainerId } = req.body;
  if (!planName || !trainerId) {
    return res.status(400).json({ message: "planName and trainerId are required" });
  }

  // If an active enrollment exists, return it (no re-enroll)
  let enrollment = await Enrollment.findOne({ userId, completedAt: { $exists: false } });
  if (enrollment) {
    return res.json({ enrollment });
  }

  const trainer = await Trainer.findById(trainerId);
  if (!trainer) return res.status(404).json({ message: "Trainer not found" });

  enrollment = await Enrollment.create({
    userId,
    planName,
    trainerId,
    startedAt: new Date(),
    workouts: workoutsFor(planName),
  });

  res.status(201).json({ enrollment });
};

export const getEnrollment = async (req, res) => {
  const userId = req.user._id;
  const enrollment = await Enrollment.findOne({ userId, completedAt: { $exists: false } });
  if (!enrollment) return res.status(404).json({ message: "No active enrollment" });
  res.json({ enrollment });
};

export const completeWorkout = async (req, res) => {
  const userId = req.user._id;
  const { title } = req.body;
  const enrollment = await Enrollment.findOne({ userId, completedAt: { $exists: false } });
  if (!enrollment) return res.status(404).json({ message: "No active enrollment" });
  const w = enrollment.workouts.find((x) => x.title === title);
  if (!w) return res.status(404).json({ message: "Workout not found" });
  w.completed = true;
  w.date = new Date();
  const allDone = enrollment.workouts.every((x) => x.completed);
  if (allDone) enrollment.completedAt = new Date();
  await enrollment.save();
  res.json({ enrollment });
};

export const getWeeklyProgress = async (req, res) => {
  const userId = req.user._id;
  const enrollment = await Enrollment.findOne({ userId }).lean();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const done = (enrollment?.workouts || []).filter((w) => w.completed && new Date(w.date || 0) >= sevenDaysAgo);
  res.json({ count: done.length });
};
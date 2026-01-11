import Trainer from "../models/Trainer.js";

export const listTrainersAdmin = async (_req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (e) {
    res.status(500).json({ message: "Server error fetching trainers" });
  }
};

export const createTrainerAdmin = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (e) {
    res.status(400).json({ message: e.message || "Invalid trainer data" });
  }
};

export const updateTrainerAdmin = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.json(trainer);
  } catch (e) {
    res.status(400).json({ message: e.message || "Update failed" });
  }
};

export const deleteTrainerAdmin = async (req, res) => {
  try {
    const t = await Trainer.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: "Trainer not found" });
    res.json({ message: "Trainer deleted" });
  } catch (e) {
    res.status(500).json({ message: "Delete failed" });
  }
};
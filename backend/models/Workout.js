import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  duration: Number,
  calories: Number,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Workout", workoutSchema);

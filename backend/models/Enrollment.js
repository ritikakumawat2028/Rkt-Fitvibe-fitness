import mongoose from "mongoose";

const workoutItemSchema = new mongoose.Schema({
  title: String,
  duration: Number,
  calories: Number,
  completed: { type: Boolean, default: false },
  date: Date,
});

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String, required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    workouts: [workoutItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
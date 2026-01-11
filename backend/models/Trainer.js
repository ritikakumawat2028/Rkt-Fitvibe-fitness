import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    rate: { type: String },
    image: { type: String },
    rating: { type: Number, default: 4.8 },
    experience: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", trainerSchema);
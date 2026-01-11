// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // Hashed password
  phone: String,
  age: Number,
  gender: String,
  goal: String,
  plan: String,
  createdAt: { type: Date, default: Date.now },
  // Add fields for workout data later if needed
  // enrolledProgram: { type: mongoose.Schema.Types.ObjectId, ref: 'ProgramEnrollment' },
});

// Middleware: Hash password before saving (only if modified)
userSchema.pre("save", async function (next) {
  // 'this' refers to the document being saved
  if (!this.isModified("password")) {
    return next(); // If password hasn't changed, skip hashing
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password with salt
    next();
  } catch (error) {
    next(error); // Pass error to mongoose error handling
  }
});

// Method: Compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password stored in the database for this user
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

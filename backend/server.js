// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // Needed for register/login here
import jwt from "jsonwebtoken"; // Needed for user login JWT

// --- Load Environment Variables ---
// Load variables from .env file ONCE at the top
dotenv.config();

// --- Database ---
import connectDB from "./config/db.js"; // Correct path assuming db.js is in config

// --- Models ---
import User from "./models/User.js"; // Import User model (ensure path is correct)
// Admin model likely only needed in controllers/middleware

// --- Routes ---
import adminRoutes from "./routes/adminRoutes.js"; // Correct path assuming adminRoutes.js is in routes
import userRoutes from "./routes/userRoutes.js"; // Import user routes (ensure path is correct)

// --- Connect to Database ---
connectDB(); // Execute the connection function

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend requests
app.use(express.json()); // Allow server to accept JSON data in request bodies

// ===================== API Routes =====================

// --- Mount Admin Routes ---
// Any request starting with /api/admin will be handled by adminRoutes
app.use("/api/admin", adminRoutes);

// --- Mount User Routes ---
// Any request starting with /api/users will be handled by userRoutes
app.use("/api/users", userRoutes);

// --- Public User Authentication Routes ---

// Register API
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, goal, plan } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() }); // Ensure case-insensitive check
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Create new user (Password will be hashed by the pre-save hook in User.js model)
    const newUser = new User({ name, email, password, phone, age, gender, goal, plan });
    await newUser.save(); // This triggers the pre-save hook

    // Respond successfully (don't send back sensitive data)
    res.status(201).json({ message: "✅ User registered successfully!" });

  } catch (err) {
    console.error("Error in /api/register:", err);
    // Handle potential validation errors from Mongoose
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    res.status(500).json({ message: "❌ Error registering user" });
  }
});

// Login API (Issues JWT for Users)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) { // Assumes matchPassword method exists on User model
      // --- Generate User JWT ---
      const USER_SECRET = process.env.JWT_USER_SECRET || "dev_user_secret"; // fallback for local dev
      if (!process.env.JWT_USER_SECRET) {
        console.warn("WARNING: JWT_USER_SECRET not set. Using a development fallback secret.");
      }

      const token = jwt.sign(
        { id: user._id }, // Payload: typically just the user ID
        USER_SECRET,
        { expiresIn: "30d" } // Set token expiration (e.g., 30 days)
      );

      // --- Send Response ---
      res.json({
        message: "✅ Login successful",
        token, // The JWT token for the frontend to store
        user: { // Send back non-sensitive user info
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          // Add any other info the frontend needs immediately after login
        },
      });
    } else {
      // If user not found or password incorrect
      res.status(401).json({ message: "Invalid email or password" }); // Use 401 for authentication failure
    }
  } catch (err) {
    console.error("Error in /api/login:", err);
    res.status(500).json({ message: "❌ Server error during login" });
  }
});


// Home route (optional - keep as is)
app.get("/", (req, res) => {
  res.send("🏋️‍♂️ Fitness App Backend Running...");
});

// ===================== Start Server =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


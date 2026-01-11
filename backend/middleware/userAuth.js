    // backend/middleware/userAuth.js
    import jwt from "jsonwebtoken";
    import User from "../models/User.js"; // Adjust path if your User model is elsewhere

    // Middleware to verify user JWT and attach user to request object
    export const userAuth = async (req, res, next) => {
      let token;
      // Get token from Authorization header (e.g., "Bearer eyJhbGciOi...")
      const authHeader = req.headers.authorization || "";

      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          // Extract token from header
          token = authHeader.split(" ")[1];

          // Verify token using the USER secret key
          if (!process.env.JWT_USER_SECRET) {
            console.error("CRITICAL: JWT_USER_SECRET environment variable is not set!");
            // Don't expose this specific error to the client
            return res.status(500).json({ message: "Server configuration error." });
          }
          const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

          // Find the user associated with the token ID
          // Select '-password' to exclude the hashed password from the user object
          req.user = await User.findById(decoded.id).select("-password");

          // Check if user still exists (e.g., wasn't deleted after token was issued)
          if (!req.user) {
             console.log(`User Auth Failed: User ID ${decoded.id} not found.`); // Server log
             return res.status(401).json({ message: "Authorization failed. User not found." });
          }

          // User is authenticated, proceed to the next middleware or route handler
          next();
        } catch (error) {
          // Handle different JWT errors
          console.error("User Auth Error:", error.name, "-", error.message); // Server log
          if (error.name === 'JsonWebTokenError') {
              return res.status(401).json({ message: "Not authorized, invalid token." });
          } else if (error.name === 'TokenExpiredError') {
              return res.status(401).json({ message: "Not authorized, token expired." });
          } else {
              // Other potential errors during verification
              return res.status(401).json({ message: "Not authorized, token validation failed." });
          }
        }
      }

      // If no token was found in the header
      if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided." });
      }
    };
    


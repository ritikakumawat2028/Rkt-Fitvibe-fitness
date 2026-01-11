import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// This is the one and only declaration
const adminAuth = async (req, res, next) => {
  let token;

  // Check for the token in the 'Authorization' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET); // <-- Using your .env variable

      // 3. Find the admin from the token's ID and attach it to the request
      req.admin = await Admin.findById(decoded.id).select('-password');

      // 4. Check if admin exists and has the 'admin' role
      if (!req.admin || req.admin.role !== 'admin') {
        throw new Error('Not authorized as an admin');
      }

      next(); // Token is valid, proceed to the controller
    } catch (error) {
      console.error('Admin auth error:', error.message);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// This is the one and only export
export default adminAuth;


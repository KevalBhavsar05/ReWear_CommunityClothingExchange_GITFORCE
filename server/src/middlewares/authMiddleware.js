import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.token;
    
    if (!token) {
      // Check Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const jwtSecret = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";
    const decodeToken = jwt.verify(token, jwtSecret);
    const user = await User.findById(decodeToken.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.log("Auth middleware error:", e.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

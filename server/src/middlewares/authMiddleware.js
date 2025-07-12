import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. User not found." 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token." 
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required." 
      });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error." 
    });
  }
};

export const validateRegistration = (req, res, next) => {
  const { name, email, password, city, country } = req.body;

  if (!name || !email || !password || !city || !country) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required" 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide a valid email address" 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 6 characters long" 
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      message: "Name must be at least 2 characters long" 
    });
  }

  if (city.trim().length < 2 || country.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      message: "City and country must be at least 2 characters long" 
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required" 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide a valid email address" 
    });
  }

  next();
};

export const hasSufficientPoints = (requiredPoints = 0) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required." 
      });
    }

    if (req.user.points < requiredPoints) {
      return res.status(403).json({ 
        success: false, 
        message: `Insufficient points. Required: ${requiredPoints}, Available: ${req.user.points}` 
      });
    }

    next();
  };
};
export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        success: false, 
        message: "Too many requests. Please try again later." 
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
  };
};

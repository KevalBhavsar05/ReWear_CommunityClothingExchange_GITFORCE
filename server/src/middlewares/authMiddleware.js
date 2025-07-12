import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Unauthorized user" });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodeToken.id).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

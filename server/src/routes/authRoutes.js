import express from "express";
import {
  register,
  login,
  logout,
  sendResetPassOtp,
  resetPassword,
  getUserData,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { resetPassOtpLimiter } from "../middlewares/otpRateLimiter.js";
import Item from "../models/item.js";

const router = express.Router();
router.post("/register", register);
router.get("/me", authMiddleware, getUserData);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-reset-password-otp", resetPassOtpLimiter, sendResetPassOtp);
router.post("/reset-password", resetPassword);

// Get user statistics
router.get("/user/stats", authMiddleware, async (req, res) => {
  try {
    const totalItems = await Item.countDocuments({ owner: req.user._id });
    const activeItems = await Item.countDocuments({ 
      owner: req.user._id, 
      isAvailable: true,
      isApproved: true 
    });
    
    // Get swap statistics
    const SwapRequest = (await import("../models/swapRequest.js")).default;
    const completedSwaps = await SwapRequest.countDocuments({
      $or: [
        { requester: req.user._id, status: "completed" },
        { itemOwner: req.user._id, status: "completed" }
      ]
    });
    
    // Get redemption statistics
    const Redemption = (await import("../models/redemption.js")).default;
    const totalRedemptions = await Redemption.countDocuments({ user: req.user._id });
    const pointsSpent = await Redemption.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: "$pointsSpent" } } }
    ]);
    
    const pointsEarned = 0; // Placeholder for future implementation

    const stats = {
      totalItems,
      activeItems,
      completedSwaps,
      totalRedemptions,
      pointsEarned,
      pointsSpent: pointsSpent.length > 0 ? pointsSpent[0].total : 0
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;

import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Redemption from "../models/redemption.js";
import Item from "../models/item.js";
import User from "../models/user.js";

const router = express.Router();

// Get user's redemptions
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const redemptions = await Redemption.find({ user: req.user._id })
      .populate("item", "title images category size condition points")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, redemptions });
  } catch (error) {
    console.error("Error fetching user redemptions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Complete redemption
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const redemption = await Redemption.findById(req.params.id);
    
    if (!redemption) {
      return res.status(404).json({ success: false, message: "Redemption not found" });
    }
    
    if (redemption.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to complete this redemption" });
    }
    
    if (redemption.status !== "pending") {
      return res.status(400).json({ success: false, message: "Redemption is not pending" });
    }
    
    redemption.status = "completed";
    redemption.completedAt = new Date();
    await redemption.save();
    
    res.json({ success: true, message: "Redemption completed successfully" });
  } catch (error) {
    console.error("Error completing redemption:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Cancel redemption
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const redemption = await Redemption.findById(req.params.id)
      .populate("item");
    
    if (!redemption) {
      return res.status(404).json({ success: false, message: "Redemption not found" });
    }
    
    if (redemption.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this redemption" });
    }
    
    if (redemption.status !== "pending") {
      return res.status(400).json({ success: false, message: "Redemption is not pending" });
    }
    
    // Refund points to user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: redemption.pointsSpent }
    });
    
    // Mark item as available again
    if (redemption.item) {
      await Item.findByIdAndUpdate(redemption.item._id, { isAvailable: true });
    }
    
    redemption.status = "cancelled";
    await redemption.save();
    
    res.json({ success: true, message: "Redemption cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling redemption:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router; 
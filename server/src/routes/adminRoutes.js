import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
import User from "../models/user.js";
import Item from "../models/item.js";
import SwapRequest from "../models/swapRequest.js";

const router = express.Router();

// Get admin statistics
router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {

    // Get current month and previous months for growth calculation
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const month = (currentMonth - i + 12) % 12;
      const year = currentYear - Math.floor((i - currentMonth) / 12);
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const monthItems = await Item.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });
      
      const monthUsers = await User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      });
      
      const monthSwaps = await SwapRequest.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
        status: "completed"
      });
      
      monthlyData.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short' }),
        items: monthItems,
        users: monthUsers,
        swaps: monthSwaps
      });
    }

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const pendingItems = await Item.countDocuments({ isApproved: false });
    const approvedItems = await Item.countDocuments({ isApproved: true });
    const availableItems = await Item.countDocuments({ isAvailable: true, isApproved: true });
    
    // Get swap statistics
    const totalSwaps = await SwapRequest.countDocuments({ status: "completed" });
    const pendingSwaps = await SwapRequest.countDocuments({ status: "pending" });
    const acceptedSwaps = await SwapRequest.countDocuments({ status: "accepted" });
    
    // Get redemption statistics
    const Redemption = (await import("../models/redemption.js")).default;
    const totalRedemptions = await Redemption.countDocuments();
    const completedRedemptions = await Redemption.countDocuments({ status: "completed" });
    const totalPointsSpent = await Redemption.aggregate([
      { $group: { _id: null, total: { $sum: "$pointsSpent" } } }
    ]);
    
    // Get category distribution
    const categoryStats = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get user activity (users with most items)
    const topUsers = await Item.aggregate([
      { $group: { _id: "$owner", itemCount: { $sum: 1 } } },
      { $sort: { itemCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $project: { name: "$user.name", email: "$user.email", itemCount: 1 } }
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalItems,
        pendingItems,
        approvedItems,
        availableItems,
        totalSwaps,
        pendingSwaps,
        acceptedSwaps,
        totalRedemptions,
        completedRedemptions,
        totalPointsSpent: totalPointsSpent.length > 0 ? totalPointsSpent[0].total : 0
      },
      monthlyGrowth: monthlyData,
      categoryDistribution: categoryStats,
      topUsers
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get pending items for admin approval
router.get("/pending-items", authMiddleware, isAdmin, async (req, res) => {
  try {
    const pendingItems = await Item.find({ isApproved: false })
      .populate("owner", "name email city country")
      .sort({ createdAt: -1 });

    res.json({ success: true, items: pendingItems });
  } catch (error) {
    console.error("Error fetching pending items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Approve item
router.put("/approve-item/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item approved successfully", item });
  } catch (error) {
    console.error("Error approving item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Reject item
router.put("/reject-item/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item rejected and deleted successfully" });
  } catch (error) {
    console.error("Error rejecting item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;

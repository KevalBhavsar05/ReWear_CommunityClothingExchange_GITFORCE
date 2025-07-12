import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import SwapRequest from "../models/swapRequest.js";
import Item from "../models/item.js";
import User from "../models/user.js";

const router = express.Router();

// Get user's swap requests (sent by user)
router.get("/sent", authMiddleware, async (req, res) => {
  try {
    const swapRequests = await SwapRequest.find({ requester: req.user._id })
      .populate("requestedItem", "title images category size condition")
      .populate("offeredItem", "title images category size condition")
      .populate("itemOwner", "name email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, swapRequests });
  } catch (error) {
    console.error("Error fetching sent swap requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get swap requests received by user
router.get("/received", authMiddleware, async (req, res) => {
  try {
    const swapRequests = await SwapRequest.find({ itemOwner: req.user._id })
      .populate("requestedItem", "title images category size condition")
      .populate("offeredItem", "title images category size condition")
      .populate("requester", "name email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, swapRequests });
  } catch (error) {
    console.error("Error fetching received swap requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Accept swap request
router.put("/:id/accept", authMiddleware, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate("requestedItem")
      .populate("offeredItem");
    
    if (!swapRequest) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }
    
    if (swapRequest.itemOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to accept this request" });
    }
    
    if (swapRequest.status !== "pending") {
      return res.status(400).json({ success: false, message: "Swap request is not pending" });
    }
    
    // Mark both items as unavailable
    await Item.findByIdAndUpdate(swapRequest.requestedItem._id, { isAvailable: false });
    await Item.findByIdAndUpdate(swapRequest.offeredItem._id, { isAvailable: false });
    
    // Update swap request status
    swapRequest.status = "accepted";
    await swapRequest.save();
    
    res.json({ success: true, message: "Swap request accepted successfully" });
  } catch (error) {
    console.error("Error accepting swap request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Reject swap request
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }
    
    if (swapRequest.itemOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to reject this request" });
    }
    
    if (swapRequest.status !== "pending") {
      return res.status(400).json({ success: false, message: "Swap request is not pending" });
    }
    
    swapRequest.status = "rejected";
    await swapRequest.save();
    
    res.json({ success: true, message: "Swap request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting swap request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Complete swap
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);
    
    if (!swapRequest) {
      return res.status(404).json({ success: false, message: "Swap request not found" });
    }
    
    if (swapRequest.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Swap request is not accepted" });
    }
    
    // Check if user is either the requester or item owner
    if (swapRequest.requester.toString() !== req.user._id.toString() && 
        swapRequest.itemOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to complete this swap" });
    }
    
    swapRequest.status = "completed";
    swapRequest.completedAt = new Date();
    await swapRequest.save();
    
    res.json({ success: true, message: "Swap completed successfully" });
  } catch (error) {
    console.error("Error completing swap:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router; 
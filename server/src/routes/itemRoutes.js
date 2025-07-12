import express from "express";
import Item from "../models/item.js";
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getUserItems,
  requestSwap,
  redeemWithPoints,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllItems);

// Admin routes - pending items (must come before /:id route)
router.get("/pending", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("Fetching pending items...");
    console.log("User:", req.user);
    
    const pendingItems = await Item.find({ isApproved: false })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    
    console.log(`Found ${pendingItems.length} pending items`);
    res.json({ success: true, items: pendingItems });
  } catch (error) {
    console.error("Error fetching pending items:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

router.get("/:id", getItem);

// Protected routes
router.post("/", authMiddleware, upload.array("images", 5), createItem);
router.put("/:id", authMiddleware, upload.array("images", 5), updateItem);
router.delete("/:id", authMiddleware, deleteItem);
router.get("/user/items", authMiddleware, getUserItems);
router.post("/:id/swap", authMiddleware, requestSwap);
router.post("/:id/redeem", authMiddleware, redeemWithPoints);

// Admin routes - approve/reject items
router.put("/:id/approve", authMiddleware, isAdmin, async (req, res) => {
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

router.put("/:id/reject", authMiddleware, isAdmin, async (req, res) => {
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
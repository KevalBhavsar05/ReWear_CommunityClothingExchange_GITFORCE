import Item from "../models/item.js";
import User from "../models/user.js";
import SwapRequest from "../models/swapRequest.js";
import Redemption from "../models/redemption.js";

// Get all items (with filters)
export const getAllItems = async (req, res) => {
  try {
    const { category, type, size, condition, search, page = 1, limit = 12 } = req.query;
    
    let query = { isAvailable: true, isApproved: true };
    
    // Apply filters
    if (category) query.category = category;
    if (type) query.type = type;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const items = await Item.find(query)
      .populate("owner", "name email city country")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Item.countDocuments(query);
    
    res.json({
      success: true,
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + items.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("owner", "name email city country points");
    
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    res.json({ success: true, item });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create new item
export const createItem = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, points, tags } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    
    if (!title || !description || !category || !type || !size || !condition) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }
    
    if (type === "Points" && (!points || points <= 0)) {
      return res.status(400).json({ success: false, message: "Points must be greater than 0 for Points items" });
    }
    
    if (images.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }
    
    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      points: type === "Points" ? points : 0,
      images,
      owner: req.user._id,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      location: {
        city: req.user.city,
        country: req.user.country
      }
    });
    
    await item.save();
    
    res.status(201).json({ success: true, message: "Item created successfully", item });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    // Check if user owns the item or is admin
    if (item.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to update this item" });
    }
    
    const updates = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    
    if (images.length > 0) {
      updates.images = images;
    }
    
    if (updates.tags) {
      updates.tags = updates.tags.split(",").map(tag => tag.trim());
    }
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    // Check if user owns the item or is admin
    if (item.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this item" });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user's items
export const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Request swap
export const requestSwap = async (req, res) => {
  try {
    const { offeredItemId, message } = req.body;
    const requestedItemId = req.params.id;
    
    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem) {
      return res.status(404).json({ success: false, message: "Requested item not found" });
    }
    
    const offeredItem = await Item.findById(offeredItemId);
    if (!offeredItem) {
      return res.status(404).json({ success: false, message: "Offered item not found" });
    }
    
    if (!requestedItem.isAvailable) {
      return res.status(400).json({ success: false, message: "Requested item is not available" });
    }
    
    if (!offeredItem.isAvailable) {
      return res.status(400).json({ success: false, message: "Offered item is not available" });
    }
    
    if (requestedItem.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot request swap for your own item" });
    }
    
    if (offeredItem.owner.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can only offer your own items" });
    }
    
    if (requestedItem.type !== "Swap") {
      return res.status(400).json({ success: false, message: "This item is not available for swapping" });
    }
    
    if (offeredItem.type !== "Swap") {
      return res.status(400).json({ success: false, message: "You can only offer swap items" });
    }
    
    // Check if swap request already exists
    const existingRequest = await SwapRequest.findOne({
      requester: req.user._id,
      requestedItem: requestedItemId,
      status: { $in: ["pending", "accepted"] }
    });
    
    if (existingRequest) {
      return res.status(400).json({ success: false, message: "You have already requested a swap for this item" });
    }
    
    const swapRequest = new SwapRequest({
      requester: req.user._id,
      itemOwner: requestedItem.owner,
      requestedItem: requestedItemId,
      offeredItem: offeredItemId,
      message: message || ""
    });
    
    await swapRequest.save();
    
    res.json({ success: true, message: "Swap request sent successfully", swapRequest });
  } catch (error) {
    console.error("Error requesting swap:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Redeem with points
export const redeemWithPoints = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    
    if (item.type !== "Points") {
      return res.status(400).json({ success: false, message: "This item cannot be redeemed with points" });
    }
    
    if (!item.isAvailable) {
      return res.status(400).json({ success: false, message: "Item is not available" });
    }
    
    if (req.user.points < item.points) {
      return res.status(400).json({ success: false, message: "Insufficient points" });
    }
    
    // Create redemption record
    const redemption = new Redemption({
      user: req.user._id,
      item: itemId,
      pointsSpent: item.points,
      status: "pending"
    });
    
    await redemption.save();
    
    // Deduct points from user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { $inc: { points: -item.points } },
      { new: true }
    ).select("-password");
    
    // Mark item as unavailable
    await Item.findByIdAndUpdate(itemId, { isAvailable: false });
    
    res.json({ 
      success: true, 
      message: "Item redeemed successfully",
      user: updatedUser,
      redemption
    });
  } catch (error) {
    console.error("Error redeeming item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}; 
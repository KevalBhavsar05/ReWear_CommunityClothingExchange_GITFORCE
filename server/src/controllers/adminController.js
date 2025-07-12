import Product from "../models/product.js";
import User from "../models/user.js";

// 1. Get all unapproved products
export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ approved: false, isActive: true }).populate("owner", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Approve a product
export const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.approved = true;
    await product.save();

    res.json({ message: "Product approved", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Reject (delete) a product
export const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product rejected and deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role banned createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Ban a user
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.banned = true;
    await user.save();

    res.json({ message: "User banned", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Platform-wide notification stub (to implement later)
export const sendBroadcastMessage = async (req, res) => {
  // You can implement sending emails or socket events
  res.status(200).json({ message: "Broadcast message sent (simulated)" });
};

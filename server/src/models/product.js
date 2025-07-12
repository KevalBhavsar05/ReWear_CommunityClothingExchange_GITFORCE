import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  approved: { type: Boolean, default: false },
  title: String,
  description: String,
  category: String,
  type: { type: String, default: "clothing" },
  size: String,
  images: [String], // URLs
  condition: String,
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "available" }, // or 'redeemed', 'swapped'
  pointValue: { type: Number, default: 10 },
  swapType: { type: String, enum: ["points", "direct"], default: "points" },
  swapWith: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // For direct swaps
  redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For redeemed products
  redeemedAt: Date, // Timestamp for when the product was redeemed
  swapRequested: { type: Boolean, default: false }, // For swap requests
  swapRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who requested the swap
  swapRequestedAt: Date, // Timestamp for when the swap was requested
  isActive: { type: Boolean, default: true }, // For deactivated products
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);

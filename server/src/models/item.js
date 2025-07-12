import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories", "Other"],
  },
  type: {
    type: String,
    required: true,
    enum: ["Swap", "Points"],
  },
  size: {
    type: String,
    required: true,
    enum: ["XS", "S", "M", "L", "XL", "XXL", "One Size"],
  },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Like New", "Good", "Fair", "Used"],
  },
  images: [{
    type: String,
    required: true,
  }],
  points: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  location: {
    city: String,
    country: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
itemSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Item", itemSchema); 
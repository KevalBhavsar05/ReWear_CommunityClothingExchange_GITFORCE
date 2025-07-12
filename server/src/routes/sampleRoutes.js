import express from "express";

const router = express.Router();

// Sample images data
const sampleImages = [
  {
    id: 1,
    name: "Blue Denim Jacket",
    category: "Outerwear",
    url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
    type: "Swap",
    description: "A classic blue denim jacket in excellent condition"
  },
  {
    id: 2,
    name: "White T-Shirt",
    category: "Tops",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    type: "Points",
    description: "Comfortable white t-shirt perfect for everyday wear"
  },
  {
    id: 3,
    name: "Black Jeans",
    category: "Bottoms",
    url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    type: "Swap",
    description: "Stylish black jeans with a modern fit"
  },
  {
    id: 4,
    name: "Summer Dress",
    category: "Dresses",
    url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
    type: "Points",
    description: "Beautiful summer dress perfect for warm weather"
  },
  {
    id: 5,
    name: "Leather Jacket",
    category: "Outerwear",
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    type: "Swap",
    description: "Classic leather jacket with timeless appeal"
  },
  {
    id: 6,
    name: "Sneakers",
    category: "Shoes",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    type: "Points",
    description: "Comfortable sneakers for casual wear"
  },
  {
    id: 7,
    name: "Sunglasses",
    category: "Accessories",
    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    type: "Swap",
    description: "Stylish sunglasses to complete any outfit"
  },
  {
    id: 8,
    name: "Hoodie",
    category: "Tops",
    url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    type: "Points",
    description: "Warm and comfortable hoodie for cooler days"
  },
  {
    id: 9,
    name: "Formal Shirt",
    category: "Tops",
    url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    type: "Swap",
    description: "Professional formal shirt for business occasions"
  },
  {
    id: 10,
    name: "Winter Coat",
    category: "Outerwear",
    url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
    type: "Points",
    description: "Warm winter coat to keep you cozy in cold weather"
  }
];

// Get all sample images
router.get("/", (req, res) => {
  res.json({ success: true, images: sampleImages });
});

// Get sample images by category
router.get("/category/:category", (req, res) => {
  const { category } = req.params;
  const filteredImages = sampleImages.filter(img => 
    img.category.toLowerCase() === category.toLowerCase()
  );
  res.json({ success: true, images: filteredImages });
});

// Get sample images by type
router.get("/type/:type", (req, res) => {
  const { type } = req.params;
  const filteredImages = sampleImages.filter(img => 
    img.type.toLowerCase() === type.toLowerCase()
  );
  res.json({ success: true, images: filteredImages });
});

// Get a specific sample image by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const image = sampleImages.find(img => img.id === parseInt(id));
  
  if (!image) {
    return res.status(404).json({ success: false, message: "Sample image not found" });
  }
  
  res.json({ success: true, image });
});

export default router; 
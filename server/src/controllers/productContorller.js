import Product from "../models/product.js";

// 1. Add a product
export const createProduct = async (req, res) => {
  try {
    const { title, description, category, type, size, condition, tags } =
    req.body;
    const userId = req.user._id;
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const imageUrls = req.files.map((file) => {
      const relativePath = file.path.replace(/\\/g, "/"); // handle Windows backslashes
      return `${baseUrl}/${relativePath}`;
    });

    const product = await Product.create({
      ...req.body,
      approved: false,
      images: imageUrls,
      owner: userId,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all products
export const getAllProducts = async (req, res) => {
  try {
    const filters = { isActive: true, approved: true };

    if (req.query.category) filters.category = req.query.category;
    if (req.query.size) filters.size = req.query.size;
    if (req.query.tags) filters.tags = { $in: req.query.tags.split(",") };

    const products = await Product.find(filters).populate(
      "owner",
      "name email"
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("owner");
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Redeem with points
export const redeemProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.status !== "available") {
      return res.status(400).json({ error: "Item not available" });
    }

    product.status = "redeemed";
    product.redeemedBy = req.body.userId; // from frontend
    product.redeemedAt = new Date();
    await product.save();

    res.json({ message: "Product redeemed", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Request a swap
export const requestSwap = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.swapRequested) {
      return res.status(400).json({ error: "Already requested or invalid" });
    }

    product.swapRequested = true;
    product.swapRequestedBy = req.body.userId;
    product.swapRequestedAt = new Date();
    await product.save();

    res.json({ message: "Swap requested", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Delete or deactivate
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.body.userId;
    const product = await Product.findById(req.params.id);
    if (!product || product.owner.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    // Instead of deleting, we deactivate
    if (product.status === "redeemed") {
      return res.status(400).json({ error: "Cannot delete redeemed product" });
    }
    // Deactivate product
    product.isActive = false;
    await product.save();
    res.json({ message: "Product deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

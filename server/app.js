import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDb from "./config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import swapRoutes from "./src/routes/swapRoutes.js";
import redemptionRoutes from "./src/routes/redemptionRoutes.js";
import sampleRoutes from "./src/routes/sampleRoutes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/redemptions", redemptionRoutes);
app.use("/api/samples", sampleRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ReWear - Community Clothing Exchange API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items",
      products: "/api/products",
      admin: "/api/admin",
      swaps: "/api/swaps",
      redemptions: "/api/redemptions",
    },
  });
});

// Health check endpoint to test database connection
app.get("/health", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };
    
    res.json({
      success: true,
      message: "Server is running",
      database: states[connectionState] || "unknown",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ReWear server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
});

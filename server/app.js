import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDb from "./config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

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
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ReWear - Community Clothing Exchange API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ReWear server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  redeemProduct,
  requestSwap,
  deleteProduct,
} from "../controllers/productContorller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👉 Use multer here for uploading
router.post("/", upload.array("images", 4), authMiddleware,createProduct); // max 4 images
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.patch("/:id/redeem", redeemProduct);
router.patch("/:id/swap", requestSwap);
router.delete("/:id", deleteProduct);

export default router;

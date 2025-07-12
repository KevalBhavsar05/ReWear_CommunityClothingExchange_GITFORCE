import express from "express";
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllUsers,
  banUser,
  sendBroadcastMessage,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdminMiddleware.js";

const router = express.Router();    

// Moderate Products
router.get("/products/pending", authMiddleware, isAdmin, getPendingProducts);
router.patch("/products/:id/approve", authMiddleware, isAdmin, approveProduct);
router.delete("/products/:id/reject", authMiddleware, isAdmin, rejectProduct);

// User Management
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.patch("/users/:id/ban", authMiddleware, isAdmin, banUser);

// Platform-wide message (future feature)
router.post("/broadcast", authMiddleware, isAdmin, sendBroadcastMessage);

export default router;

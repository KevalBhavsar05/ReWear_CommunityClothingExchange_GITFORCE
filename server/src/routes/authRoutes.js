import express from "express";
import {
  register,
  login,
  logout,
  sendResetPassOtp,
  resetPassword,
} from "../controllers/authController.js";

import { resetPassOtpLimiter } from "../middlewares/otpRateLimiter.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-reset-password-otp", resetPassOtpLimiter, sendResetPassOtp);
router.post("/reset-password", resetPassword);

export default router;

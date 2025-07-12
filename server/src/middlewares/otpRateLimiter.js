import rateLimit from "express-rate-limit";

// Password reset OTP limiter (strict)
export const resetPassOtpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req) => req.user?.email || req.ip,
  message: {
    success: false,
    message: "Too many password reset requests. Try again after an hour.",
  },
});

// Verification OTP limiter
export const verificationOtpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req) => req.user.email || req.ip,
  message: {
    success: false,
    message: "Too many verification attempts. Try again after an hour.",
  },
});

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  points: { type: Number, default: 30 }, // Signup bonus
  city: String,
  country: String,
  resetPassOtp: String,
  resetPassOtpExpiresAt: Date,
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);

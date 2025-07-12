import User from "../models/user.js";
import bcrypt from "bcrypt";
import { genToken } from "../utils/generateToken.js";
import transporter from "../../config/nodemailer.js";
import { generateOtp } from "../utils/generateOtp.js";

//Register
export const register = async (req, res) => {
  const { name, email, password, city, country } = req.body;

  if (!name || !email || !password || !city || !country) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.json({
      success: false,
      message: "User already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      city,
      country,
    });
    
    const mailData = {
      from: `"AuthSystem" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Registered Successfully",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333;">Welcome <span style="color: #4CAF50;">${name}</span> to <strong>AuthSystem</strong>...!</h2>
      <p style="font-size: 16px; color: #555;">Your account has been created successfully with the following email:</p>
      <ul style="list-style: none; padding-left: 0;">
      <li style="padding: 10px 0; font-size: 16px; color: #333;"><strong>Email ID:</strong> ${email}</li>
        </ul>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">Thank you for registering with us.</p>
        </div>
        </div>
        `,
    };

    await transporter.sendMail(mailData);
    await user.save();

    const token = genToken(user._id);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000, //1day
      })
      .json({
        success: true,
        message: "Registered successfully",
        token: token,
      });
  } catch (e) {
    console.error(e);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or passoword",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = genToken(user._id);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000, //1day
      })
      .json({ success: true, message: "Logged in successfully", token: token });
  } catch (e) {
    console.log(e.message);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

//Logout
export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
    })
    .json({ success: true, message: "Logged out successfully" });
};
//Send-Reset-Password-Otp
export const sendResetPassOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPassOtp = otp;
    user.resetPassOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const otpMailData = {
      from: `"AuthSystem" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Reset Password",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi <b>${user.name || "User"}</b>,</p>
      <p>We received a request to reset your password for your account. Use the OTP below to reset your password:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color: #e0e0e0; border-radius: 8px; color: #333;">
          ${otp}
        </span>
      </div>
      <p>This OTP is valid for <b>10 minutes</b>. If you didn’t request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br/>The AuthSystem Team</p>
    </div>
  `,
    };
    await transporter.sendMail(otpMailData);
    return res.json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (e) {
    console.error(e);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

//Reset-Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }
    //Check email
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    // Check if OTP matches
    if (user.resetPassOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    //Check if OTP is expired
    if (user.resetPassOtpExpiresAt < new Date())
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });

    //Hash the new password
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;

    // 5. Clear OTP data
    user.resetPassOtp = undefined;
    user.resetPassOtpExpiresAt = undefined;

    await user.save();

    //Send success email to user
    const passChangeSuccessMailData = {
      from: `"AuthSystem" <${process.env.SENDER_EMAIL}>`,
      to: email, // recipient's email
      subject: "Your Password Has Been Changed",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
      <h2 style="color: #4CAF50;">Password Changed Successfully</h2>
      <p>Hi <b>${user.name || "User"}</b>,</p>
      <p>This is a confirmation that your account password was changed successfully.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-left: 5px solid #4CAF50;">
        <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleString(
          "en-IN",
          { timeZone: "Asia/Kolkata" }
        )}</p>
        <p style="margin: 0;"><strong>Account Email:</strong> ${email}</p>
      </div>
      <p>Thanks,<br/>The AuthSystem Team</p>
    </div>
  `,
    };

    await transporter.sendMail(passChangeSuccessMailData);
    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (e) {
    console.error(e);
    return res.json({
      success: false,
      message: e.message,
    });
  }
};

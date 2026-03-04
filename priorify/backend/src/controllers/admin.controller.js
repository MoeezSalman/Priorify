const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 chars." });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 chars." });
    }

    const existing = await Admin.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username: username.trim(),
      passwordHash
    });

    return res.status(201).json({
      message: "Admin created",
      admin: { id: admin._id, username: admin.username }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // For now, just return success (later you can add JWT token)
    return res.status(200).json({
      message: "Login successful",
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const makeOtp = () => String(Math.floor(1000 + Math.random() * 9000)); // 4-digit

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ✅ app password
  },
});

exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body; // email

    if (!username) {
      return res.status(400).json({ message: "Email is required." });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(404).json({ message: "No user found with this email." });
    }

    const otp = makeOtp();

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    admin.resetOtpHash = otpHash;
    admin.resetOtpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    await admin.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.username,
      subject: "Priorify Reset OTP",
      text: `Your OTP is: ${otp}\nThis OTP expires in 2 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) return res.status(404).json({ message: "User not found." });

    if (!admin.resetOtpHash || !admin.resetOtpExpires) {
      return res.status(400).json({ message: "OTP not requested." });
    }

    if (admin.resetOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (otpHash !== admin.resetOtpHash) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    return res.status(200).json({ message: "OTP verified." });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;

    if (!username || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and newPassword are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) return res.status(404).json({ message: "User not found." });

    if (!admin.resetOtpHash || !admin.resetOtpExpires) {
      return res.status(400).json({ message: "OTP not requested." });
    }

    if (admin.resetOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (otpHash !== admin.resetOtpHash) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    admin.resetOtpHash = null;
    admin.resetOtpExpires = null;
    await admin.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
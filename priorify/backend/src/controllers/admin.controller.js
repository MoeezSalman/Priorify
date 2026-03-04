const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

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
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Engineer = require("../models/Engineer");

exports.createAdmin = async (req, res) => {
  try {

    const { firstName, lastName, username, password, role, subrole } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 chars." });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 chars." });
    }
    const existingAdmin = await Admin.findOne({ username: username.trim() });
const existingEngineer = await Engineer.findOne({ username: username.trim() });

if (existingAdmin || existingEngineer) {
  return res.status(409).json({ message: "Username already exists." });
}
    const passwordHash = await bcrypt.hash(password, 10);

    // PROJECT MANAGER -> ADMIN TABLE
    if (role === "pm") {

      const existing = await Admin.findOne({ username: username.trim() });

      

      const admin = await Admin.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        passwordHash,
        role: "admin"
      });

      return res.status(201).json({
      message: "Admin created",
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        role: "pm"
      }
});

    }

    // TEAM MEMBER -> ENGINEER TABLE
    if (role === "tm") {

      const existing = await Engineer.findOne({ username: username.trim() });

      

      const engineer = await Engineer.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        role: subrole,
        passwordHash,
        appointed: false,
        appointedBy: null
      });

      return res.status(201).json({
        message: "Engineer created",
        user: {
          id: engineer._id,
          firstName: engineer.firstName,
          lastName: engineer.lastName,
          username: engineer.username,
          role: engineer.role
        }
      });

    }

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

    // Check admin first
    let user = await Admin.findOne({ username: username.trim() });
    let role = "pm";

    if (!user) {
      // If not admin, check engineer
      user = await Engineer.findOne({ username: username.trim() });
      role = user?.role;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role
      }
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

    let user = await Admin.findOne({ username: username.trim() });
    let table = "admin";

    if (!user) {
      user = await Engineer.findOne({ username: username.trim() });
      table = "engineer";
    }

    if (!user) {
      return res.status(404).json({ message: "No user found with this email." });
    }

    const otp = makeOtp();

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtpHash = otpHash;
    user.resetOtpExpires = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.username,
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

    let user = await Admin.findOne({ username: username.trim() });

    if (!user) {
      user = await Engineer.findOne({ username: username.trim() });
    }

    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({ message: "OTP not requested." });
    }

    if (user.resetOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (otpHash !== user.resetOtpHash) {
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

    let user = await Admin.findOne({ username: username.trim() });

    if (!user) {
      user = await Engineer.findOne({ username: username.trim() });
    }

    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({ message: "OTP not requested." });
    }

    if (user.resetOtpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (otpHash !== user.resetOtpHash) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = null;
    user.resetOtpExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.createTeam = async (req, res) => {
  try {
    const { adminId, teamName, focus, members } = req.body;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure team array exists
    if (!admin.team) {
      admin.team = [];
    }

    admin.team.push({
      teamName,
      focus,
      members
    });

    await admin.save();

    // Update engineers
    await Engineer.updateMany(
      { _id: { $in: members } },
      {
        $set: {
          appointed: true,
          appointedBy: adminId
        }
      }
    );

    res.status(200).json({
      message: "Team created successfully"
    });

  } catch (err) {
    console.error("createTeam error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getEngineers = async (req, res) => {

  const engineers = await Engineer.find({
    appointed: false
  });

  res.json(engineers);
};

exports.getTeams = async (req, res) => {
  try {

    const admin = await Admin.findById(req.params.adminId)
      .populate("team.members");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin.team);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
};

exports.updateTeam = async (req, res) => {

  const { adminId, teamName, members } = req.body;
  const { teamId } = req.params;

  try {

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const team = admin.team.id(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // previous members
    const oldMembers = team.members.map(m => m.toString());

    // new members
    const newMembers = members;

    // detect removed members
    const removedMembers = oldMembers.filter(
      id => !newMembers.includes(id)
    );

    // detect added members
    const addedMembers = newMembers.filter(
      id => !oldMembers.includes(id)
    );

    // update team
    team.teamName = teamName;
    team.members = newMembers;

    // REMOVE members from team
    if (removedMembers.length > 0) {
      await Engineer.updateMany(
        { _id: { $in: removedMembers } },
        {
          $set: {
            appointed: false,
            appointedBy: null
          }
        }
      );
    }

    // ADD members to team
    if (addedMembers.length > 0) {
      await Engineer.updateMany(
        { _id: { $in: addedMembers } },
        {
          $set: {
            appointed: true,
            appointedBy: adminId
          }
        }
      );
    }

    await admin.save();

    res.json({ message: "Team updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

};

exports.deleteTeam = async (req, res) => {
  try {
    const { adminId } = req.body;
    const { teamId } = req.params;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const team = admin.team.id(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const memberIds = team.members;

    admin.team.pull(teamId);

    await Engineer.updateMany(
      { _id: { $in: memberIds } },
      { $set: { appointed: false, appointedBy: null } }
    );

    await admin.save();

    res.json({ message: "Team deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




const mongoose = require("mongoose");

const engineerSchema = new mongoose.Schema(
{
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  username: { type: String, required: true, unique: true, trim: true },

  role: {
    type: String,
    enum: ["maintenance_engineer", "requirement_engineer"],
    required: true
  },

  passwordHash: { type: String, required: true },

  resetOtpHash: { type: String, default: null },
  resetOtpExpires: { type: Date, default: null },

  appointed: {
    type: Boolean,
    default: false
  },

  appointedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Engineer", engineerSchema);
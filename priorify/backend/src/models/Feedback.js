const mongoose = require("mongoose");
 
const feedbackSchema = new mongoose.Schema(
  {
    feedback: { type: String, required: true, trim: true },
    resolve:  { type: Boolean, default: false },
    mentions: { type: Number, default: 1, min: 1 },  // ← NEW
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Feedback", feedbackSchema);
 
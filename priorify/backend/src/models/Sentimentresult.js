const mongoose = require("mongoose");

const sentimentResultSchema = new mongoose.Schema(
  {
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
      unique: true,
    },
    feedbackText: { type: String, required: true },
    sentiment:    { type: String, enum: ["Positive", "Negative", "Neutral"], required: true },
    score:        { type: Number, min: 0, max: 100, required: true },
    priority:     { type: String, enum: ["High", "Medium", "Low"], required: true },
    resolve:      { type: Boolean, default: false },
    mentions:     { type: Number, default: 1 },  // pulled from Feedback doc
    rawScores: {
      positive: Number,
      negative: Number,
      neutral:  Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SentimentResult", sentimentResultSchema);
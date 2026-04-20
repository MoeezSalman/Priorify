const mongoose = require("mongoose");
 
const keywordEntrySchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true },
    count:   { type: Number, required: true, min: 0 },
  },
  { _id: false }
);
 
const keywordStatsSchema = new mongoose.Schema(
  {
    // "all" | "positive" | "negative" | "neutral"
    category: {
      type:     String,
      enum:     ["all", "positive", "negative", "neutral"],
      required: true,
      unique:   true,
    },
    keywords: {
      type:    [keywordEntrySchema],
      default: [],
    },
    // When was this snapshot generated?
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("KeywordStats", keywordStatsSchema);
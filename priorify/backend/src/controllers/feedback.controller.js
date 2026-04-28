const Feedback        = require("../models/Feedback");
const SentimentResult = require("../models/SentimentResult");
const KeywordStats    = require("../models/KeywordStats");

// GET /api/feedback/stats
exports.getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback   = await Feedback.countDocuments();
    const unresolvedItems = await Feedback.countDocuments({ resolve: false });

    // Total mentions across all feedback
    const mentionsAgg = await Feedback.aggregate([
      { $group: { _id: null, totalMentions: { $sum: "$mentions" } } },
    ]);
    const totalMentions = mentionsAgg[0]?.totalMentions || 0;

    // Positive sentiment % from SentimentResult collection
    const totalAnalysed   = await SentimentResult.countDocuments();
    const positiveCount   = await SentimentResult.countDocuments({ sentiment: "Positive" });
    const positiveSentiment =
      totalAnalysed > 0 ? Math.round((positiveCount / totalAnalysed) * 100) : 0;

    return res.status(200).json({
      totalFeedback,
      positiveSentiment,   // now a real % from DB
      unresolvedItems,
      totalMentions,
    });
  } catch (err) {
    console.error("getFeedbackStats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/feedback/keywords?category=all|positive|negative|neutral&limit=8
// Returns keywords array from KeywordStats for the requested category
exports.getKeywords = async (req, res) => {
  try {
    const category = req.query.category || "all";
    const limit    = parseInt(req.query.limit, 10) || 8;

    const validCategories = ["all", "positive", "negative", "neutral"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const doc = await KeywordStats.findOne({ category });

    if (!doc || !doc.keywords.length) {
      return res.status(200).json({ category, keywords: [] });
    }

    // Sort by count desc, then slice to limit
    const keywords = [...doc.keywords]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return res.status(200).json({ category, keywords, generatedAt: doc.generatedAt });
  } catch (err) {
    console.error("getKeywords error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ mentions: -1, createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (err) {
    console.error("getAllFeedback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/feedback/:id/mention
exports.incrementMention = async (req, res) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { mentions: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Feedback not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("incrementMention error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
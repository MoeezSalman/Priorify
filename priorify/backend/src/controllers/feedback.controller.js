const Feedback = require("../models/Feedback");

// GET /api/feedback/stats
exports.getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback   = await Feedback.countDocuments();
    const unresolvedItems = await Feedback.countDocuments({ resolve: false });

    // Total mentions across all feedback (sum of mentions field)
    const mentionsAgg = await Feedback.aggregate([
      { $group: { _id: null, totalMentions: { $sum: "$mentions" } } }
    ]);
    const totalMentions = mentionsAgg[0]?.totalMentions || 0;

    return res.status(200).json({
      totalFeedback,
      positiveSentiment: 0,
      unresolvedItems,
      totalMentions,        // ← NEW
    });
  } catch (err) {
    console.error("getFeedbackStats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/feedback
exports.getAllFeedback = async (req, res) => {
  try {
    // Sort by mentions descending so most-mentioned feedback comes first
    const feedbacks = await Feedback.find().sort({ mentions: -1, createdAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (err) {
    console.error("getAllFeedback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/feedback/:id/mention
// Call this every time a user submits the same/similar feedback again
exports.incrementMention = async (req, res) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { mentions: 1 } },   // increment by 1
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Feedback not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("incrementMention error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
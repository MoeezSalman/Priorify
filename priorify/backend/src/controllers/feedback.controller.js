const Feedback = require("../models/Feedback");

exports.getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const unresolvedItems = await Feedback.countDocuments({ resolve: false });

    return res.status(200).json({
      totalFeedback,
      positiveSentiment: 0, // for now as you requested
      unresolvedItems,
    });
  } catch (err) {
    console.error("getFeedbackStats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json(feedbacks);
  } catch (err) {
    console.error("getAllFeedback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
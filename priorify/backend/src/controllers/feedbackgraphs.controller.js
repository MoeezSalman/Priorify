const express = require("express");
const router = express.Router();
const SentimentResult = require("../models/SentimentResult");

// GET /api/feedbackgraphs/stats
// Returns all aggregated data needed for the FeatureGraphs frontend
router.get("/stats", async (req, res) => {
  try {
    const all = await SentimentResult.find({});

    const total = all.length;

    // --- Sentiment counts ---
    const positiveCount = all.filter(f => f.sentiment === "Positive").length;
    const negativeCount = all.filter(f => f.sentiment === "Negative").length;
    const neutralCount  = all.filter(f => f.sentiment === "Neutral").length;

    // --- Priority counts ---
    const highCount   = all.filter(f => f.priority === "High").length;
    const mediumCount = all.filter(f => f.priority === "Medium").length;
    const lowCount    = all.filter(f => f.priority === "Low").length;

    // --- Sentiment Trend by Month ---
    // Groups documents by month and counts positive/negative per month
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const trendMap = {};

    all.forEach(doc => {
      const date = new Date(doc.createdAt);
      const monthKey = monthNames[date.getMonth()];

      if (!trendMap[monthKey]) {
        trendMap[monthKey] = { month: monthKey, positive: 0, negative: 0, monthIndex: date.getMonth() };
      }

      if (doc.sentiment === "Positive") trendMap[monthKey].positive += 1;
      if (doc.sentiment === "Negative") trendMap[monthKey].negative += 1;
    });

    // Sort by month order Jan -> Dec
    const sentimentTrend = Object.values(trendMap).sort((a, b) => a.monthIndex - b.monthIndex);

    res.json({
      total,
      sentimentCounts: {
        positive: positiveCount,
        negative: negativeCount,
        neutral:  neutralCount,
      },
      sentimentPercentages: {
        positive: total ? Math.round((positiveCount / total) * 100) : 0,
        negative: total ? Math.round((negativeCount / total) * 100) : 0,
        neutral:  total ? Math.round((neutralCount  / total) * 100) : 0,
      },
      priorityCounts: {
        high:   highCount,
        medium: mediumCount,
        low:    lowCount,
      },
      sentimentTrend, // array: [{ month, positive, negative }, ...]
    });

  } catch (err) {
    console.error("feedbackgraphs/stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
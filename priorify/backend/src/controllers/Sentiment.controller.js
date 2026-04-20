const Feedback        = require("../models/Feedback");
const SentimentResult = require("../models/SentimentResult");

const HF_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest";

// ─── Call HuggingFace Inference API ──────────────────────────────────────────
async function runSentiment(text) {
  const res = await fetch(
    `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
    {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HF API ${res.status}: ${body}`);
  }

  const data    = await res.json();
  const results = Array.isArray(data[0]) ? data[0] : data;
  const top     = results.reduce((a, b) => (a.score > b.score ? a : b));

  const sentiment =
    top.label.charAt(0).toUpperCase() + top.label.slice(1).toLowerCase();
  const score = Math.round(top.score * 100);

  const rawScores = {};
  results.forEach((r) => {
    rawScores[r.label.toLowerCase()] = Math.round(r.score * 100);
  });

  return { sentiment, score, rawScores };
}

// ─── Priority logic ───────────────────────────────────────────────────────────
function derivePriority(sentiment, score) {
  if (sentiment === "Negative") return score >= 70 ? "High" : "Medium";
  if (sentiment === "Neutral")  return "Medium";
  return score >= 60 ? "Low" : "Medium";
}

// ─── POST /api/sentiment/analyze  (run + save) ────────────────────────────────
exports.analyzeFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.status(200).json({ message: "No feedback found", summary: {}, results: [] });
    }

    const analysed = [];

    for (const fb of feedbacks) {
      try {
        const { sentiment, score, rawScores } = await runSentiment(fb.feedback);
        const priority = derivePriority(sentiment, score);

        const saved = await SentimentResult.findOneAndUpdate(
          { feedbackId: fb._id },
          {
            feedbackId:   fb._id,
            feedbackText: fb.feedback,
            sentiment,
            score,
            priority,
            resolve:      fb.resolve,
            mentions:     fb.mentions,  // ← actual value from Feedback doc
            rawScores,
          },
          { upsert: true, new: true }
        );

        analysed.push(saved);
      } catch (err) {
        console.error(`  ✗ [${fb._id}] ${err.message}`);
        const fallback = await SentimentResult.findOneAndUpdate(
          { feedbackId: fb._id },
          {
            feedbackId:   fb._id,
            feedbackText: fb.feedback,
            sentiment:    "Neutral",
            score:        50,
            priority:     "Medium",
            resolve:      fb.resolve,
            mentions:     fb.mentions,  // ← actual value even on fallback
            rawScores:    {},
          },
          { upsert: true, new: true }
        );
        analysed.push({ ...fallback.toObject(), error: true });
      }
    }

    const summary = buildSummary(analysed);
    return res.status(200).json({ summary, results: analysed });
  } catch (err) {
    console.error("analyzeFeedback:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── GET /api/sentiment/results  (read stored) ───────────────────────────────
exports.getResults = async (req, res) => {
  try {
    const stored = await SentimentResult.find().sort({ mentions: -1, createdAt: -1 });
    const summary = buildSummary(stored);
    return res.status(200).json({ summary, results: stored });
  } catch (err) {
    console.error("getResults:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildSummary(rows) {
  const total    = rows.length;
  const positive = rows.filter((r) => r.sentiment === "Positive").length;
  const negative = rows.filter((r) => r.sentiment === "Negative").length;
  const neutral  = rows.filter((r) => r.sentiment === "Neutral").length;
  const high     = rows.filter((r) => r.priority  === "High").length;
  const medium   = rows.filter((r) => r.priority  === "Medium").length;
  const low      = rows.filter((r) => r.priority  === "Low").length;
  const avgScore = total
    ? Math.round(rows.reduce((s, r) => s + r.score, 0) / total)
    : 0;
  return { total, positive, negative, neutral, high, medium, low, avgScore };
}
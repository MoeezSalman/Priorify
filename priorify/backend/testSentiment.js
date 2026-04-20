
require("dotenv").config();
const mongoose = require("mongoose");

const Feedback        = require("./src/models/Feedback");
const SentimentResult = require("./src/models/SentimentResult");

const HF_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest";

// ── HuggingFace call ──────────────────────────────────────────────────────────
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
  const score     = Math.round(top.score * 100);

  const rawScores = {};
  results.forEach((r) => { rawScores[r.label.toLowerCase()] = Math.round(r.score * 100); });

  return { sentiment, score, rawScores };
}

// ── Priority logic ────────────────────────────────────────────────────────────
function derivePriority(sentiment, score) {
  if (sentiment === "Negative") return score >= 70 ? "High" : "Medium";
  if (sentiment === "Neutral")  return "Medium";
  return score >= 60 ? "Low" : "Medium";
}

// ── Colours ───────────────────────────────────────────────────────────────────
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";
const RED    = "\x1b[31m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const GREY   = "\x1b[90m";

const colorSentiment = (s) =>
  s === "Positive" ? `${GREEN}${s}${RESET}` :
  s === "Negative" ? `${RED}${s}${RESET}`   : `${YELLOW}${s}${RESET}`;

const colorPriority = (p) =>
  p === "High"   ? `${RED}${BOLD}${p}${RESET}` :
  p === "Medium" ? `${YELLOW}${p}${RESET}`      : `${GREEN}${p}${RESET}`;

const scoreBar = (n) => {
  const filled = Math.round(n / 5);
  return "█".repeat(filled) + "░".repeat(20 - filled) + ` ${n}`;
};

const truncate = (str, len) =>
  str.length > len ? str.slice(0, len - 1) + "…" : str.padEnd(len);

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Guard
  if (!process.env.HF_API_KEY || process.env.HF_API_KEY === "hf_YOUR_TOKEN_HERE") {
    console.error(`\n${RED}${BOLD}ERROR:${RESET} HF_API_KEY is missing in .env`);
    console.error(`  Add:  HF_API_KEY=hf_xxxx  to backend/.env\n`);
    process.exit(1);
  }

  // 2. Connect
  console.log(`\n${CYAN}${BOLD}Connecting to MongoDB…${RESET}`);
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`${GREEN}✔ Connected${RESET}\n`);

  // 3. Load feedback docs
  const feedbacks = await Feedback.find().sort({ mentions: -1, createdAt: -1 });
  if (feedbacks.length === 0) {
    console.log(`${YELLOW}No feedback found. Run createfeedback.js first.${RESET}`);
    process.exit(0);
  }
  console.log(`${BOLD}Found ${feedbacks.length} feedback document(s).${RESET}`);
  console.log(`${GREY}Model: ${HF_MODEL}${RESET}\n`);

  // 4. Analyse + save
  const rows = [];

  for (let i = 0; i < feedbacks.length; i++) {
    const fb = feedbacks[i];
    process.stdout.write(
      `  [${i + 1}/${feedbacks.length}] ${GREY}${fb.feedback.slice(0, 45)}…${RESET} `
    );

    try {
      const { sentiment, score, rawScores } = await runSentiment(fb.feedback);
      const priority = derivePriority(sentiment, score);

      // Save to DB — mentions comes directly from fb.mentions (the real Feedback doc value)
      await SentimentResult.findOneAndUpdate(
        { feedbackId: fb._id },
        {
          feedbackId:   fb._id,
          feedbackText: fb.feedback,
          sentiment,
          score,
          priority,
          resolve:      fb.resolve,
          mentions:     fb.mentions,   // ← actual value from Feedback collection
          rawScores,
        },
        { upsert: true, new: true }
      );

      rows.push({
        feedback:  fb.feedback,
        mentions:  fb.mentions,
        sentiment,
        score,
        priority,
        resolve:   fb.resolve,
        rawScores,
      });

      console.log(`${GREEN}✔ ${sentiment} (${score}) | mentions: ${fb.mentions}${RESET}`);
    } catch (err) {
      console.log(`${RED}✗ ${err.message}${RESET}`);
      // Save fallback but still store real mentions
      await SentimentResult.findOneAndUpdate(
        { feedbackId: fb._id },
        {
          feedbackId:   fb._id,
          feedbackText: fb.feedback,
          sentiment:    "Neutral",
          score:        50,
          priority:     "Medium",
          resolve:      fb.resolve,
          mentions:     fb.mentions,  // ← real value even on error
          rawScores:    {},
        },
        { upsert: true, new: true }
      );
      rows.push({ feedback: fb.feedback, mentions: fb.mentions, sentiment: "Error", score: 0, priority: "—", resolve: fb.resolve, error: true });
    }
  }

  // 5. Print results table
  const LINE = "─".repeat(120);
  console.log(`\n${BOLD}${LINE}${RESET}`);
  console.log(
    `${BOLD}  ${"FEEDBACK".padEnd(45)}  ${"MENTIONS".padEnd(9)}  ${"SENTIMENT".padEnd(10)}  ${"SCORE".padEnd(25)}  ${"PRIORITY".padEnd(8)}  STATUS${RESET}`
  );
  console.log(`${BOLD}${LINE}${RESET}`);

  for (const r of rows) {
    if (r.error) {
      console.log(`  ${truncate(r.feedback, 45)}  ${String(r.mentions).padEnd(9)}  ${RED}Error${RESET}`);
      continue;
    }
    const status = r.resolve ? `${GREEN}Resolved${RESET}` : `${YELLOW}Open${RESET}`;
    console.log(
      `  ${truncate(r.feedback, 45)}  ${CYAN}${String(r.mentions).padEnd(9)}${RESET}  ${colorSentiment(r.sentiment).padEnd(19)}  ${scoreBar(r.score).padEnd(25)}  ${colorPriority(r.priority).padEnd(17)}  ${status}`
    );
    if (r.rawScores && Object.keys(r.rawScores).length > 0) {
      const raw = Object.entries(r.rawScores).map(([k, v]) => `${k}: ${v}`).join("  |  ");
      console.log(`  ${GREY}  ↳ Raw scores: ${raw}${RESET}`);
    }
  }

  console.log(`${BOLD}${LINE}${RESET}\n`);

  // 6. Summary
  const ok       = rows.filter((r) => !r.error);
  const positive = ok.filter((r) => r.sentiment === "Positive").length;
  const negative = ok.filter((r) => r.sentiment === "Negative").length;
  const neutral  = ok.filter((r) => r.sentiment === "Neutral").length;
  const high     = ok.filter((r) => r.priority  === "High").length;
  const medium   = ok.filter((r) => r.priority  === "Medium").length;
  const low      = ok.filter((r) => r.priority  === "Low").length;
  const avg      = ok.length ? Math.round(ok.reduce((s, r) => s + r.score, 0) / ok.length) : 0;
  const totalMentions = rows.reduce((s, r) => s + (r.mentions || 0), 0);

  console.log(`${BOLD}Summary${RESET}`);
  console.log(`  Total analysed  : ${ok.length} / ${rows.length}`);
  console.log(`  Total mentions  : ${CYAN}${totalMentions}${RESET}`);
  console.log(`  Sentiment       : ${GREEN}Positive ${positive}${RESET}  |  ${RED}Negative ${negative}${RESET}  |  ${YELLOW}Neutral ${neutral}${RESET}`);
  console.log(`  Priority        : ${RED}High ${high}${RESET}  |  ${YELLOW}Medium ${medium}${RESET}  |  ${GREEN}Low ${low}${RESET}`);
  console.log(`  Avg score       : ${avg}`);

  // 7. DB verification
  const storedCount = await SentimentResult.countDocuments();
  console.log(`\n${BOLD}DB Verification${RESET}`);
  console.log(`  SentimentResult documents in MongoDB : ${CYAN}${BOLD}${storedCount}${RESET}`);

  // Show what's actually stored
  const stored = await SentimentResult.find().sort({ mentions: -1 });
  console.log(`\n  ${BOLD}Stored SentimentResult records:${RESET}`);
  stored.forEach((r) => {
    console.log(
      `  • ${truncate(r.feedbackText, 45)} | mentions: ${CYAN}${r.mentions}${RESET} | ${colorSentiment(r.sentiment)} (${r.score}) | ${colorPriority(r.priority)}`
    );
  });

  if (storedCount === feedbacks.length) {
    console.log(`\n  ${GREEN}${BOLD}✔ All ${feedbacks.length} records stored correctly with actual mention counts!${RESET}\n`);
  } else {
    console.log(`\n  ${YELLOW}⚠ Expected ${feedbacks.length}, found ${storedCount}${RESET}\n`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(`\n${RED}Fatal:${RESET}`, err.message);
  process.exit(1);
});
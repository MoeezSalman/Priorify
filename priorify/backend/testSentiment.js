require("dotenv").config();
const mongoose = require("mongoose");

const Feedback        = require("./src/models/Feedback");
const SentimentResult = require("./src/models/SentimentResult");
const KeywordStats    = require("./src/models/KeywordStats");

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

// ── Keyword extraction ────────────────────────────────────────────────────────
// Common English stop-words to filter out so only meaningful keywords remain.
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","as","is","was","are","were","be","been","being","have",
  "has","had","do","does","did","will","would","could","should","may",
  "might","shall","can","not","no","nor","so","yet","both","either",
  "neither","each","few","more","most","other","some","such","than",
  "too","very","just","also","then","that","this","these","those","it",
  "its","i","my","me","we","our","you","your","he","his","him","she",
  "her","they","their","them","what","which","who","whom","when","where",
  "why","how","all","any","about","up","out","if","into","through",
  "during","before","after","above","below","between","same","own",
  "while","there","here","really","very","like","get","got","im","ive",
  "dont","cant","wont","isnt","wasnt","didnt","doesnt","wouldnt",
  "couldnt","shouldnt","hasnt","havent","hadnt","app","use","used",
  "using","still","even","make","made","makes","much","many","every",
  "great","good","bad","well","also","s","t","re","ve","ll","d","m",
]);

/**
 * Tokenise a piece of text, strip stop-words and short tokens,
 * and return a frequency map  { word -> count }.
 *
 * @param {string} text
 * @returns {Map<string, number>}
 */
function extractWordFreq(text) {
  const freq = new Map();
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")   // strip punctuation
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));

  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

/**
 * Merge multiple frequency maps into one.
 *
 * @param {Map<string, number>[]} maps
 * @returns {Map<string, number>}
 */
function mergeMaps(maps) {
  const merged = new Map();
  for (const m of maps) {
    m.forEach((count, word) => {
      merged.set(word, (merged.get(word) || 0) + count);
    });
  }
  return merged;
}

/**
 * Convert a frequency map to a sorted array of { keyword, count } objects,
 * keeping only the top N entries.
 *
 * @param {Map<string, number>} freqMap
 * @param {number} topN
 * @returns {{ keyword: string, count: number }[]}
 */
function topKeywords(freqMap, topN = 20) {
  return [...freqMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([keyword, count]) => ({ keyword, count }));
}

/**
 * Build keyword frequency maps split by sentiment category and save each
 * as a single document (upsert) in the KeywordStats collection.
 *
 * @param {{ feedbackText: string, sentiment: string }[]} rows
 */
async function saveKeywordStats(rows) {
  // Buckets: all feedback + per-sentiment
  const buckets = { all: [], positive: [], negative: [], neutral: [] };

  for (const r of rows) {
    const freq = extractWordFreq(r.feedbackText);
    buckets.all.push(freq);

    const key = r.sentiment.toLowerCase();
    if (buckets[key]) buckets[key].push(freq);
  }

  for (const [category, maps] of Object.entries(buckets)) {
    if (maps.length === 0) continue;

    const merged   = mergeMaps(maps);
    const keywords = topKeywords(merged, 20);

    await KeywordStats.findOneAndUpdate(
      { category },
      { category, keywords, generatedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(
      `  ${CYAN}[keywords:${category}]${RESET} saved top ${keywords.length} keywords`
    );
  }
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

  // 4. Analyse + save SentimentResult
  const rows = [];

  for (let i = 0; i < feedbacks.length; i++) {
    const fb = feedbacks[i];
    process.stdout.write(
      `  [${i + 1}/${feedbacks.length}] ${GREY}${fb.feedback.slice(0, 45)}…${RESET} `
    );

    try {
      const { sentiment, score, rawScores } = await runSentiment(fb.feedback);
      const priority = derivePriority(sentiment, score);

      await SentimentResult.findOneAndUpdate(
        { feedbackId: fb._id },
        {
          feedbackId:   fb._id,
          feedbackText: fb.feedback,
          sentiment,
          score,
          priority,
          resolve:      fb.resolve,
          mentions:     fb.mentions,
          rawScores,
        },
        { upsert: true, new: true }
      );

      rows.push({
        feedbackText: fb.feedback,
        mentions:     fb.mentions,
        sentiment,
        score,
        priority,
        resolve:      fb.resolve,
        rawScores,
      });

      console.log(`${GREEN}✔ ${sentiment} (${score}) | mentions: ${fb.mentions}${RESET}`);
    } catch (err) {
      console.log(`${RED}✗ ${err.message}${RESET}`);
      await SentimentResult.findOneAndUpdate(
        { feedbackId: fb._id },
        {
          feedbackId:   fb._id,
          feedbackText: fb.feedback,
          sentiment:    "Neutral",
          score:        50,
          priority:     "Medium",
          resolve:      fb.resolve,
          mentions:     fb.mentions,
          rawScores:    {},
        },
        { upsert: true, new: true }
      );
      rows.push({
        feedbackText: fb.feedback,
        mentions:     fb.mentions,
        sentiment:    "Neutral",  // treat errors as Neutral for keyword bucketing
        score:        0,
        priority:     "—",
        resolve:      fb.resolve,
        error:        true,
      });
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
      console.log(`  ${truncate(r.feedbackText, 45)}  ${String(r.mentions).padEnd(9)}  ${RED}Error${RESET}`);
      continue;
    }
    const status = r.resolve ? `${GREEN}Resolved${RESET}` : `${YELLOW}Open${RESET}`;
    console.log(
      `  ${truncate(r.feedbackText, 45)}  ${CYAN}${String(r.mentions).padEnd(9)}${RESET}  ${colorSentiment(r.sentiment).padEnd(19)}  ${scoreBar(r.score).padEnd(25)}  ${colorPriority(r.priority).padEnd(17)}  ${status}`
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

  // 7. Extract keywords & save to KeywordStats collection
  console.log(`\n${BOLD}Extracting & saving keyword stats…${RESET}`);
  await saveKeywordStats(rows);

  // Print top keywords for "all" and "negative" as a quick preview
  const allStats = await KeywordStats.findOne({ category: "all" });
  const negStats = await KeywordStats.findOne({ category: "negative" });

  if (allStats && allStats.keywords.length > 0) {
    const top10 = allStats.keywords.slice(0, 10).map((k) => `${CYAN}${k.keyword}${RESET}(${k.count})`).join("  ");
    console.log(`\n  ${BOLD}Top keywords (all):${RESET}  ${top10}`);
  }

  if (negStats && negStats.keywords.length > 0) {
    const top10 = negStats.keywords.slice(0, 10).map((k) => `${RED}${k.keyword}${RESET}(${k.count})`).join("  ");
    console.log(`  ${BOLD}Top keywords (negative):${RESET}  ${top10}`);
  }

  // 8. DB verification
  const storedCount   = await SentimentResult.countDocuments();
  const keywordDocs   = await KeywordStats.countDocuments();
  console.log(`\n${BOLD}DB Verification${RESET}`);
  console.log(`  SentimentResult documents : ${CYAN}${BOLD}${storedCount}${RESET}`);
  console.log(`  KeywordStats documents    : ${CYAN}${BOLD}${keywordDocs}${RESET} (one per category: all | positive | negative | neutral)`);

  // Show stored records
  const stored = await SentimentResult.find().sort({ mentions: -1 });
  console.log(`\n  ${BOLD}Stored SentimentResult records:${RESET}`);
  stored.forEach((r) => {
    console.log(
      `  • ${truncate(r.feedbackText, 45)} | mentions: ${CYAN}${r.mentions}${RESET} | ${colorSentiment(r.sentiment)} (${r.score}) | ${colorPriority(r.priority)}`
    );
  });

  if (storedCount === feedbacks.length) {
    console.log(`\n  ${GREEN}${BOLD}✔ All ${feedbacks.length} records stored correctly with actual mention counts!${RESET}`);
  } else {
    console.log(`\n  ${YELLOW}⚠ Expected ${feedbacks.length}, found ${storedCount}${RESET}`);
  }

  console.log(`  ${GREEN}${BOLD}✔ KeywordStats saved for ${keywordDocs} categories.${RESET}\n`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(`\n${RED}Fatal:${RESET}`, err.message);
  process.exit(1);
});
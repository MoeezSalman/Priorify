const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const Feedback = require("./src/models/Feedback");

// ─── Source DB (your dedicated feedback seed database on Atlas) ───────────────
// Replace with the connection string of your feedback_source_db cluster.
// Keep this separate from your main MONGO_URI in .env if you prefer,
// or add FEEDBACK_SOURCE_URI to your .env file.
const SOURCE_MONGO_URI =
  process.env.FEEDBACK_SOURCE_URI ||
  "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/feedback_source_db?retryWrites=true&w=majority";
// ──────────────────────────────────────────────────────────────────────────────

async function seedFeedback() {
  const sourceClient = new MongoClient(SOURCE_MONGO_URI);

  try {
    // 1. Connect to the source DB and fetch all feedbacks
    await sourceClient.connect();
    console.log("✅ Connected to source (feedback_source_db)");

    const sourceDb = sourceClient.db("feedback_source_db");
    const sourceFeedbacks = await sourceDb
      .collection("feedbacks")
      .find({}, { projection: { _id: 0, feedback: 1, resolve: 1 } })
      .toArray();

    if (!sourceFeedbacks.length) {
      console.error("❌ No feedbacks found in source DB. Run feedbackSource.js first.");
      process.exit(1);
    }

    console.log(`📥 Fetched ${sourceFeedbacks.length} feedbacks from source DB`);

    // 2. Connect to the main project DB via Mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to main DB (priorify_db)");

    // 3. Clear old feedbacks and insert the fetched ones
    await Feedback.deleteMany({});
    console.log("🗑️  Old feedbacks cleared from main DB");

    await Feedback.insertMany(sourceFeedbacks);
    console.log(
      `✔  ${sourceFeedbacks.length} feedbacks inserted into main DB (mentions defaults to 1 each)`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  } finally {
    await sourceClient.close();
    await mongoose.disconnect();
  }
}

seedFeedback();
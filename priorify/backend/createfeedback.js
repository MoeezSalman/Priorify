const mongoose = require("mongoose");
require("dotenv").config();

const Feedback = require("./src/models/Feedback");

// mentions starts at 1 for every new feedback (no hardcoding)
// it grows naturally via PATCH /api/feedback/:id/mention when users repeat it
const feedbackData = [
  { feedback: "The dashboard is very useful and easy to understand.", resolve: false },
  { feedback: "Login page looks great, but forgot password should be faster.", resolve: false },
  { feedback: "Need dark mode support in the application.", resolve: true },
  { feedback: "Feature analytics page should have export option.", resolve: false },
  { feedback: "Login screen is not responsive.", resolve: false },
  { feedback: "There should be better UI.", resolve: false },
  { feedback: "The UI is clean and modern.", resolve: true },
  { feedback: "Notifications should be less frequent.", resolve: false },
];

async function seedFeedback() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Feedback.deleteMany({});
    console.log("Old feedback deleted");

    await Feedback.insertMany(feedbackData);
    console.log(`✔ ${feedbackData.length} feedback documents inserted (mentions defaults to 1 each)`);

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedFeedback();
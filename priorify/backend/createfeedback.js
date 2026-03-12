const mongoose = require("mongoose");
require("dotenv").config();

const Feedback = require("./src/models/Feedback");

const feedbackData = [
  {
    feedback: "The dashboard is very useful and easy to understand.",
    resolve: false,
  },
  {
    feedback: "Login page looks great, but forgot password should be faster.",
    resolve: false,
  },
  {
    feedback: "Need dark mode support in the application.",
    resolve: true,
  },
  {
    feedback: "Feature analytics page should have export option.",
    resolve: false,
  },
  {
    feedback: "The UI is clean and modern.",
    resolve: true,
  },
  {
    feedback: "Notifications should be less frequent.",
    resolve: false,
  },
];

async function seedFeedback() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Feedback.deleteMany({});
    console.log("Old feedback deleted");

    await Feedback.insertMany(feedbackData);
    console.log("Feedback data inserted");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedFeedback();
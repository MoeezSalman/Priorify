const router = require("express").Router();
const {
  getFeedbackStats,
  getAllFeedback,
} = require("../controllers/feedback.controller");

router.get("/stats", getFeedbackStats);
router.get("/", getAllFeedback);

module.exports = router;
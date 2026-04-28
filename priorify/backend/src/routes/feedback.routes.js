const router = require("express").Router();
const {
  getFeedbackStats,
  getKeywords,
  getAllFeedback,
  incrementMention,
} = require("../controllers/feedback.controller");

router.get("/stats",         getFeedbackStats);
router.get("/keywords",      getKeywords);        // ← NEW
router.get("/",              getAllFeedback);
router.patch("/:id/mention", incrementMention);

module.exports = router;
const router = require("express").Router();
const {
  getFeedbackStats,
  getAllFeedback,
  incrementMention,
} = require("../controllers/feedback.controller");
 
router.get("/stats",               getFeedbackStats);
router.get("/",                    getAllFeedback);
router.patch("/:id/mention",       incrementMention);   // ← NEW
 
module.exports = router;
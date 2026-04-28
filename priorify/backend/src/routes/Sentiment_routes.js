const router = require("express").Router();
const { getNegativeFeedback, getAllSentiment } = require("../controllers/sentiment.controller");

router.get("/", getAllSentiment);
router.get("/negative", getNegativeFeedback);

module.exports = router;
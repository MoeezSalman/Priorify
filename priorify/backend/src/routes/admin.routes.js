const router = require("express").Router();
const { createAdmin } = require("../controllers/admin.controller");

router.post("/signup", createAdmin);

module.exports = router;
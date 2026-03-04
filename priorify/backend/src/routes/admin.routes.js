const router = require("express").Router();
const { createAdmin,loginAdmin } = require("../controllers/admin.controller");

router.post("/signup", createAdmin);
router.post("/login", loginAdmin);

module.exports = router;
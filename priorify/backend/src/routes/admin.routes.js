const router = require("express").Router();
const {
  createAdmin,
  loginAdmin,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/admin.controller");

router.post("/signup", createAdmin);
router.post("/login", loginAdmin);

// ✅ add these:
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
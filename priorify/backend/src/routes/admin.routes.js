const router = require("express").Router();
const {
  createAdmin,
  loginAdmin,
  forgotPassword,
  verifyOtp,
  resetPassword,
  createTeam,
  getEngineers,
  getTeams,
  updateTeam,
  deleteTeam
} = require("../controllers/admin.controller");

router.post("/signup", createAdmin);
router.post("/login", loginAdmin);

// ✅ add these:
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/create-team", createTeam);
router.get("/engineers", getEngineers);
router.get("/teams/:adminId",getTeams);
router.put("/update-team/:teamId", updateTeam);
router.delete("/delete-team/:teamId", deleteTeam);
module.exports = router;
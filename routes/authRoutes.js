const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  isMe,
  logout,
  googleOauth,
  registrationOtpVerification,
  verifyRegistrationOtp,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, isMe);
router.post("/logout", logout);
router.post("/googleOauth", googleOauth);
router.post("/verify-otp", verifyRegistrationOtp);

module.exports = router;

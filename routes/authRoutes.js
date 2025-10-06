const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  isMe,
  logout,
  googleOauth,
  verifyRegistrationOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { validateResetToken } = require("../controllers/auth/passwordController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, isMe);
router.post("/logout", logout);
router.post("/googleOauth", googleOauth);
router.post("/verify-email", verifyRegistrationOtp);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/validate-reset-token', validateResetToken)

module.exports = router;

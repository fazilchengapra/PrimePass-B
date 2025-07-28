const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User logged in successfully",
    isLoggedIn: true,
    userId: req.user.id,
  });
});

module.exports = router;

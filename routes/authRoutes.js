const express = require("express");
const router = express.Router();
const { register, login, isMe, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, isMe);
router.post('/logout', logout)

module.exports = router;

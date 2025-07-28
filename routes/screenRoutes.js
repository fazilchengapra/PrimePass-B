const express = require("express");
const router = express.Router();
const {
  createScreen,
  getScreenById,
  getScreenByTheaterId,
  updateScreenById,
  deleteScreenById,
} = require("../controllers/screenController");
const screenMiddleware = require("../middleware/screenMiddleware");

router.post("/", screenMiddleware, createScreen);

router.get("/by-theater/:id", getScreenByTheaterId);
router.get("/:id", getScreenById);

router.put("/:id", screenMiddleware, updateScreenById);
router.delete("/:id", deleteScreenById);

module.exports = router;

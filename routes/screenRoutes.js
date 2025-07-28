const express = require("express");
const router = express.Router();
const { createScreen } = require("../controllers/screenController");
const screenMiddleware = require("../middleware/screenMiddleware");

router.post("/",screenMiddleware, createScreen);

router.get("/by-movie/:id", )
router.get("/by-theater/:code")
router.get("/:id")

module.exports = router;
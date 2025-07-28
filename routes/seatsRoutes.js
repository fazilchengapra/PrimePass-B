const express = require("express");
const router = express.Router();
const { createSeat } = require("../controllers/seatController");

router.post("/", createSeat);

module.exports = router;
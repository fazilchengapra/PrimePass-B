const express = require("express");
const { getSeatLayout } = require("../controllers/seatControllers");
const router = express.Router();

router.get("/layout/:showId", getSeatLayout);

module.exports = router;

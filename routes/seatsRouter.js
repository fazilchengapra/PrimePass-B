const express = require("express");
const { getSeatLayout, lockSeats } = require("../controllers/seatControllers");
const router = express.Router();

router.get("/layout/:showId", getSeatLayout);
router.post("/lock", lockSeats)

module.exports = router;

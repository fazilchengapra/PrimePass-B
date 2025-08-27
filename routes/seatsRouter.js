const express = require("express");
const { getSeatLayout, lockSeats } = require("../controllers/seatControllers");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/layout/:showId", getSeatLayout);
router.post("/lock",authMiddleware, lockSeats)

module.exports = router;

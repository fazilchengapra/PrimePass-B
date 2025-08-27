const express = require("express");
const {
  createPendingBooking,
  getPendingBooking,
} = require("../controllers/pendingBookingController");
const router = express.Router();

router.get("/:id", getPendingBooking);
router.post("/", createPendingBooking);

module.exports = router;

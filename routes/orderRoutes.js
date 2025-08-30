const express = require("express");
const { getBookingDetails, getBookingHistory } = require("../controllers/orderController");
const router = express.Router();

router.get("/history", getBookingHistory)
router.get("/:id", getBookingDetails);

module.exports = router;

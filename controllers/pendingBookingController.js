const pendingBookingModel = require("../models/PendingBookingModel");
const calculateSeatsTotalAmount = require("../utils/calculateSeatsTotal");
const sendResponse = require("../utils/sendResponse");
const pendingBookingValidation = require("../validations/pendingBookingValidation");
const { lockSeats } = require("./seatControllers");

exports.createPendingBooking = async (req, res) => {
  try {
    const { showId, movieTitle, showDate, seats } = req.body;

    if (!showId || !movieTitle || !showDate || !seats?.length) {
      return sendResponse(res, 400, "Missing required fields", false);
    }

    const { grandTotal, breakdown } = await calculateSeatsTotalAmount(
      seats.map((seat) => seat.id)
    );

    Object.assign(req.body, {
      userId: req.user.id,
      totalAmount: grandTotal,
      zoneDetails: breakdown,
      numberOfSeats: seats.length,
      seatIds: seats.map((s) => s.id),
    });

    const { error } = pendingBookingValidation.validate(req.body);
    if (error) return sendResponse(res, 400, error.details[0].message, false);

    const seatIds = req.body.seatIds;
    await lockSeats(req, res, seatIds);

    const newPendingRecord = await pendingBookingModel.create(req.body);

    return sendResponse(
      res,
      200,
      "Pending Booking Record Created Success!!",
      true,
      newPendingRecord
    );
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key error from Mongo unique index
      return sendResponse(res, 409, "Seat already locked for this show", false);
    }
    console.error("Error in createPendingBooking:", error);
    return sendResponse(res, 500, "Server error", false);
  }
};

exports.getPendingBooking = async (req, res) => {
  try {
    const {id} = req.params
    const pendingBooking = await pendingBookingModel.findById(id);

    if (!pendingBooking) {
      return sendResponse(res, 404, "Pending booking not found", false);
    }

    return sendResponse(
      res,
      200,
      "Pending booking retrieved successfully",
      true,
      pendingBooking
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      "Server error while fetching booking",
      false,
      {
        error: error.message,
      }
    );
  }
};

// controllers/bookingController.js
const Booking = require("../models/Booking");
const sendResponse = require("../utils/sendResponse");

exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params; // booking id from route

    const booking = await Booking.findById(id)
      .populate("userId", "name email") // only return name & email of user
      .populate(
        "showId",
        "movieId theaterId screenId startTime language format"
      ) // show details
      .populate("seats.id", "row number zoneCode") // seat info if needed
      .lean();

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        movieTitle: booking.movieTitle,
        posterUrl: booking.posterUrl,
        theaterName: booking.theaterName,
        showDate: booking.showDate,
        numberOfSeats: booking.numberOfSeats,
        seats: booking.seats,
        zoneDetails: booking.zoneDetails,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        paymentStatus: booking.paymentStatus,
        orderId: booking.orderId,
        paymentId: booking.paymentId,
      },
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you have auth middleware that sets req.user

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    // Transform data for frontend
    const formatted = bookings.map((b) => ({
      id: b?._id,
      movieTitle: b?.movieTitle,
      showTime: b?.showDate,
      theater: b?.theaterName,
      seats: b?.seats,
      totalPrice: b?.totalAmount,
      status: b?.showDate > Date.now() ? "Upcoming" : "Completed",
      qrCodeUrl: b?.qrCodeUrl || `https://yourapp.com/ticket/${b?._id}`,
    }));

    return sendResponse(res, 200, "Booking history fetch successfully!", true, {
      bookings: formatted,
    });
  } catch (err) {
    console.error("Error fetching booking history:", err);
    sendResponse(res, 500, err.message, false);
  }
};

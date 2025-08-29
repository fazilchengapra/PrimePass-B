const Seat = require("../models/Seat");

exports.bookSeats = async (seatIds, userId) => {
  if (!seatIds?.length || !userId) {
    return { success: false, message: "Missing fields" };
  }

  try {
    // Update only seats that are available OR locked by the same user
    const result = await Seat.updateMany(
      {
        _id: { $in: seatIds },
        $or: [
          { status: "available" },
          { status: "locked", lockedBy: userId }
        ]
      },
      {
        $set: {
          status: "booked",
          bookedBy: userId,
          bookedAt: new Date(),
          lockedBy: null,
          lockedAt: null
        },
        $inc: { version: 1 }
      }
    );

    // If not all seats updated, rollback logic can be applied
    if (result.modifiedCount !== seatIds.length) {
      return {
        success: false,
        message: "Some seats are not available to book"
      };
    }

    return { success: true, message: "Seats booked successfully" };
  } catch (err) {
    console.error("Error booking seats:", err);
    return { success: false, message: "Booking failed", error: err };
  }
};

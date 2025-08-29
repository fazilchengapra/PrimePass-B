const Seat = require("../models/Seat.js");

const checkSeatStatus = async (seatIds, userId) => {
  if (!seatIds?.length || !userId) {
    return { success: false, message: "Missing fields" };
  }

  // Fetch seats by IDs
  const seats = await Seat.find({ _id: { $in: seatIds } });

  if (seats.length !== seatIds.length) {
    return { success: false, message: "Some seats not found" };
  }

  // Check conditions
  const allValid = seats.every(
    (seat) => seat.status === 'locked' && String(seat.lockedBy) === String(userId)
  );

  console.log(userId);
  

  if (!allValid) {
    return { success: false, message: "Seats not locked by this user" };
  }

  return { success: true, message: "All seats valid & locked by user" };
};

module.exports={checkSeatStatus}

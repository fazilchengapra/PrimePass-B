const pendingBookingModel = require("../models/pendingBookingModel");

const checkPendingBooking = async (pendingBookingId, userId) => {
  if (!pendingBookingId || !userId) {
    return { success: false, message: "Missing fields" };
  }

  const booking = await pendingBookingModel.findById(pendingBookingId);

  if (!booking) {
    return { success: false, message: "Pending booking not found" };
  }

  // Check lock expiry
  const now = new Date();
  if (booking.lockExpiresAt && booking.lockExpiresAt < now) {
    return { success: false, message: "Booking expired" };
  }

  // Check if user matches
  if (String(booking.userId) !== String(userId)) {
    return { success: false, message: "Booking does not belong to this user" };
  }

  // Return seatIds
  return { success: true, record: booking };
};

module.exports = {checkPendingBooking}
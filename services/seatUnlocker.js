const Seat = require("../models/Seat");

async function autoUnlockSeats(io) {
  const expiryTime = new Date(Date.now() - 8 * 60 * 1000);
  console.log("Running auto-unlock for seats locked before:", expiryTime);

  // Find expired locked seats
  const expiredSeats = await Seat.find({
    status: "locked",
    lockedAt: { $lte: expiryTime },
  });

  if (expiredSeats.length > 0) {
    // Unlock them
    await Seat.updateMany(
      { _id: { $in: expiredSeats.map((s) => s._id) } },
      { $set: { status: "available", lockedBy: null, lockedAt: null } }
    );

    // Emit event with unlocked seats
    io.emit("seatUnLocked", expiredSeats.map((s) => s._id));
  }
}

function startAutoUnlock(io) {
  setInterval(() => autoUnlockSeats(io), 60 * 1000);
}

module.exports = startAutoUnlock;

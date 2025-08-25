const Seat = require("../models/Seat");


async function autoUnlockSeats() {
  const expiryTime = new Date(Date.now() - 8 * 60 * 1000);
  console.log("Running auto-unlock for seats locked before:", expiryTime);
  await Seat.updateMany(
    { status: "locked", lockedAt: { $lte: expiryTime } },
    { $set: { status: "available", lockedBy: null, lockedAt: null } }
  );
}

function startAutoUnlock() {
  setInterval(autoUnlockSeats, 60 * 1000);
}

module.exports = startAutoUnlock;

const mongoose = require("mongoose");

const seatModel = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Show",
    },
    theaterId: {
      type: String,
      required: true,
      ref: "Theater",
    },
    screenCode: {
      type: String,
      required: true,
      ref: "Screen",
    },
    zoneCode: {
      type: String,
      required: true,
      ref: "Zone",
    },
    seatNumber: {
      type: String,
      required: true, // Example: "A1"
    },
    row: {
      type: String,
      required: true, // Example: "A"
    },
    type: {
      type: String,
      enum: ["Premium", "Regular"],
      default: "Regular",
    },
    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available",
    },
    gridSeatNum: { type: Number, required: true }, // For grid-based seat management
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
      expires: 900, // 15 minutes TTL
    },
    version: { type: Number, default: 0 }, // For optimistic concurrency control
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bookedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

seatModel.index(
  { lockedAt: 1 },
  {
    expireAfterSeconds: 900,
    partialFilterExpression: { lockedAt: { $exists: true } },
  }
);

// Compound index for efficient seat availability queries
seatModel.index({ showId: 1, status: 1 });

module.exports = mongoose.model("Seat", seatModel);

const mongoose = require("mongoose");

const seatModel = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Show",
    },
    theaterCode: {
      type: String,
      required: true,
      ref: "Theater",
    },
    screenCode: {
      type: String,
      required: true,
      ref: "Screen",
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
      enum: ["available", "booked", "held"],
      default: "available",
    },
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId, // user ID
      ref: "User",
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bookedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

seatModel.index({ showId: 1, row: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Seat", seatModel);

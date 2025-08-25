const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
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
      required: true,
    },
    row: {
      type: String,
      required: true,
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
    gridSeatNum: { type: Number, required: true },

    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
      index: { expires: "8m" }, // 🔥 TTL: auto remove after 8 minutes
    },
    version: { type: Number, default: 0 },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bookedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

seatSchema.index({ showId: 1, status: 1 });

module.exports = mongoose.model("Seat", seatSchema);

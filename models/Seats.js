const mongoose = require("mongoose");

const seatModel = new mongoose.Schema(
  {
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Theater",
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Screen",
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Show",
    },
    layout: [
      {
        row: { type: String, required: true }, // "A", "B", etc.
        seats: [
          {
            seatNumber: { type: String, required: true }, // "A1", "A2"
            type: { type: String, enum: ["Premium", "Regular"], default: "Regular" },
            status: {
              type: String,
              enum: ["available", "booked", "held"],
              default: "available",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seat", seatModel);

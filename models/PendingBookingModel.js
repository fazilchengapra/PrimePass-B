const mongoose = require("mongoose");

const PendingBookingModel = new mongoose.Schema(
  {
    // User & Show
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    // Movie & Venue details
    movieTitle: { type: String, required: true },
    posterUrl: { type: String },
    theaterName: { type: String },
    showDate: { type: Date, required: true },

    // Seats
    numberOfSeats: { type: Number, required: true },
    childSeats: { type: Number, default: 0 },
    seats: [
      {
        _id: false,
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seat",
          required: true,
        },
        row: String,
        number: String,
      },
    ],

    // ⚡ Flattened seatIds for uniqueness check
    seatIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],

    zoneDetails: [
      {
        _id: false,
        code: String,
        name: String,
        seats: Number,
        price: Number,
        total: Number,
      },
    ],

    // Pricing
    taxPercentage: { type: Number, default: 18 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Expiry
    lockExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 8 * 60 * 1000), // 8 minutes
    },
    recordExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 16 * 60 * 1000), // 16 minutes
    },
  },
  { timestamps: true }
);

// TTL index
PendingBookingModel.index({ recordExpiresAt: 1 }, { expireAfterSeconds: 0 });

// 🔥 Unique index to enforce "same seat can't be in 2 bookings for same show"
PendingBookingModel.index({ showId: 1, seatIds: 1 }, { unique: true });

module.exports = mongoose.model("PendingBooking", PendingBookingModel);

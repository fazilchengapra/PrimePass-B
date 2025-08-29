// models/Booking.js
const mongoose = require("mongoose");

const BookingModel = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showId: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },

    movieTitle: { type: String, required: true },
    posterUrl: String,
    theaterName: String,
    showDate: { type: Date, required: true },

    numberOfSeats: { type: Number, required: true },
    childSeats: { type: Number, default: 0 },
    seats: [
      {
        _id: false,
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
        row: String,
        number: String,
      },
    ],

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

    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Razorpay details
    orderId: { type: String, required: true },    // razorpay_order_id
    paymentId: { type: String },                  // razorpay_payment_id
    signature: { type: String },
    paymentStatus: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingModel);

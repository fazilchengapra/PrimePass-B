const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "theaterOwner"],
    default: "customer",
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],

  provider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  providerId: { type: String }, // Google "sub", Facebook "id", etc.
  picture: { type: String }, // profile image from provider
});

module.exports = mongoose.model("User", userModel);

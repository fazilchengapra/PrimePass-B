const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { type } = require("../validations/show.validation");
const { create } = require("./Seat");

const userModel = new mongoose.Schema(
  {
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
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    otpLockedUntil: { type: Date },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
  },
  { timestamps: true }
);

userModel.index(
  { createdAt: 1 },
  { expireAfterSeconds: 900, partialFilterExpression: { isVerified: false } }
);

module.exports = mongoose.model("User", userModel);

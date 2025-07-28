const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, enum: ['customer', 'theaterOwner'], default: 'customer'},
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
});

// Hash password before saving
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userModel);

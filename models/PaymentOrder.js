// models/PaymentOrder.js
const mongoose = require("mongoose");

const PaymentOrderModel = new mongoose.Schema(
  {
    orderId: { type: String, required: true }, // Razorpay order_id
    receipt: { type: String }, // your internal receipt id
    amount: { type: Number, required: true }, // in paise
    currency: { type: String, default: "INR" },
    status: { type: String, default: "created" }, // created, paid, failed
    paymentId: { type: String }, // Razorpay payment_id after success
    signature: { type: String }, // Razorpay signature after success
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link to your user
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentOrder", PaymentOrderModel);

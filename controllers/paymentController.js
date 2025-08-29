const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const PaymentOrder = require("../models/PaymentOrder");
const pendingBookingModel = require("../models/pendingBookingModel");
const { checkPendingBooking } = require("../services/checkPendingBooking");
const { checkSeatStatus } = require("../services/checkSeatCondition");
const { updatePaymentOrder } = require("../services/paymentOrder");
const { bookSeats } = require("../services/setSeatBooked");
const getSeatIds = require("../utils/getSeatIds");
const sendResponse = require("../utils/sendResponse");

exports.createOrder = async (req, res) => {
  try {
    const { pendingRecordId } = req.body;
    if (!pendingRecordId) return sendResponse(res, 400, "Missing field", false);

    const pendingRecord = await checkPendingBooking(
      pendingRecordId,
      req.user.id
    );
    if (!pendingRecord.success)
      return sendResponse(res, 400, pendingRecord.message, false);

    const seatIds = pendingRecord.record.seatIds;

    const checkSeats = await checkSeatStatus(seatIds, req.user.id);
    if (!checkSeats.success)
      return sendResponse(res, 400, checkSeats.message, false);

    const options = {
      amount: pendingRecord.record.totalAmount * 100,
      currency: pendingRecord.record.currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await PaymentOrder.create({
      orderId: order.id,
      receipt: order.receipt,
      amount: order.amount,
      status: order.status,
      userId: req.user.id,
    });

    return sendResponse(res, 200, "Order created success!", true, order);
  } catch (error) {
    return sendResponse(res, 500, error.message, false);
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pendingRecordId,
    } = req.body;

    // 1. Verify Razorpay signature
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return sendResponse(res, 400, "Invalid signature", false);
    }

    // 2. Find pending booking
    const pending = await pendingBookingModel.findById(pendingRecordId);
    if (!pending)
      return sendResponse(res, 400, "Pending booking not found", false);

    // 3. Create final booking
    const booking = await Booking.create({
      ...pending.toObject(),
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paymentStatus: "paid",
    });

    const seatIds = getSeatIds(pending.seats);
    const seatsBook = await bookSeats(seatIds, req.user.id);
    if (!seatsBook.success)
      return sendResponse(res, 400, seatsBook.message, false);

    const paymentOrder = await updatePaymentOrder(
      razorpay_order_id,
      req.user.id,
      razorpay_signature,
      razorpay_payment_id
    );
    if (!paymentOrder.success)
      return sendResponse(res, 400, paymentOrder.message, false);

    const io = req.app.get("io");
    io.emit("seatBooked", {
      seatIds,
      bookedBy: req.user.id,
      BookedAt: new Date(),
    });

    // 4. Delete pending booking
    await pendingBookingModel.findByIdAndDelete(pendingRecordId);

    return sendResponse(res, 200, "Payment received success!", true, {
      id: booking._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error verifying payment");
  }
};

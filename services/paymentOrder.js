const PaymentOrder = require("../models/PaymentOrder");

exports.updatePaymentOrder = async (orderId, userId, signature, paymentId) => {
  try {
    if (!orderId || !userId || !signature || !paymentId) {
      return { success: false, message: "Missing required fields" };
    }

    // Find and update
    const updatedOrder = await PaymentOrder.findOneAndUpdate(
      { orderId, userId }, // match orderId + userId
      {
        $set: {
          paymentId,
          signature,
          status: "paid", // mark as paid
        },
      },
      { new: true } // return updated document
    );

    if (!updatedOrder) {
      return { success: false, message: "Order not found or user mismatch" };
    }

    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating payment order:", error);
    return { success: false, message: "Server error", error };
  }
};

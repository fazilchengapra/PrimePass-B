const { client, twilioPhoneNumber } = require("../config/twilio");

exports.sendBookingConfirmation = async (customerPhone) => {
  try {
    const message = `
Booking Confirmed! fazil
            `.trim();

    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: customerPhone,
    });

    console.log("SMS sent successfully:", result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error.message };
  }
};

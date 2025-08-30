const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

exports.sendBookingConfirmMail = async (toEmail, bookingDetails) => {
  try {
    // 1. Setup transporter with Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // 2. Load HTML template
    const templatePath = path.join(__dirname, "../templates/bookingConfirmation.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // 3. Replace placeholders with booking data
    htmlTemplate = htmlTemplate
      .replace("{{name}}", bookingDetails.name)
      .replace("{{movie}}", bookingDetails.movie)
      .replace("{{theater}}", bookingDetails.theater)
      .replace("{{dateTime}}", bookingDetails.dateTime)
      .replace("{{seats}}", bookingDetails.seats.join(", "))
      .replace("{{amount}}", bookingDetails.amount)
      .replace("{{bookingId}}", bookingDetails.bookingId);

    // 4. Send the email
    await transporter.sendMail({
      from: `"PrimePass" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🎟️ Your Movie Booking is Confirmed!",
      html: htmlTemplate,
    });

    console.log(`✅ Booking confirmation email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending booking confirmation email:", error);
    throw error;
  }
};

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App Password
  },
});

exports.sendBookingConfirmMail = async (toEmail, bookingDetails) => {
  try {
    // 2. Load HTML template
    const templatePath = path.join(
      __dirname,
      "../templates/bookingConfirmation.html"
    );
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

exports.sendOtpEmail = async (email, name, otp) => {
  try {
    // 2. Load HTML template
    const templatePath = path.join(
      __dirname,
      "../templates/otpVerification.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // 3. Replace placeholders with booking data
    htmlTemplate = htmlTemplate
      .replaceAll("{{name}}", name)
      .replaceAll("{{otp}}", otp)
      .replaceAll("{{email}}", email)
      .replaceAll("{{expiryMinutes}}", 15);

    // 4. Send the email
    await transporter.sendMail({
      from: `"PrimePass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your One-Time Password (OTP) for PrimePass",
      html: htmlTemplate,
    });
  } catch (error) {
    throw error;
  }
};

exports.sendResetPasswordEmail = async (email, name, resetUrl) => {
  try {
    // 2. Load HTML template
    const templatePath = path.join(
      __dirname,
      "../templates/resetPassword.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // 3. Replace placeholders with booking data
    htmlTemplate = htmlTemplate
      .replaceAll("{{name}}", name)
      .replaceAll("{{mail}}", email)
      .replaceAll("{{resetUrl}}", resetUrl);
    // 4. Send the email
    await transporter.sendMail({
      from: `"PrimePass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Reset Your PrimePass Password",
      html: htmlTemplate,
    });
  } catch (error) {
    throw error;
  }
};

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("./cryptoService");
const { generateAndSendOtp } = require("./otpService");
const { sendAuthResponse } = require("../utils/jwtHelper");
require("dotenv").config();

exports.loginUser = async (res, userData) => {
  // destructuring email and pass for simplify
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Email or password incorrect");

  if (!user.isVerified) throw new Error("Email or password incorrect");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Email or password incorrect");

  sendAuthResponse(res, user);
};

exports.registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  let user = await User.findOne({ $or: [{ email }, { username }] });
  if (user && user.isVerified) {
    const field = user.email === email ? "Email" : "Username";
    throw new Error(`This ${field} already in use`);
  }

  if (user && user.otpLockedUntil && user.otpLockedUntil > Date.now()) {
    const minutesLeft = Math.ceil(
      user.otpLockedUntil - Date.now() / (60 * 1000)
    );
    throw new Error(
      `Too many invalid attempts. Please try again in ${minutesLeft} minutes.`
    );
  }

  const hashedPass = await hashPassword(password);
  if (user && !user.isVerified)
    user = await User.findByIdAndUpdate(
      { _id: user._id },
      { username, password: hashedPass, role }
    );
  else
    user = await User.create({ username, email, password: hashedPass, role });
  await generateAndSendOtp(user._id, user.email, user.username);
};

exports.registrationOtpVerification = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid Credentials");

  if (user.isVerified) throw new Error("Something went wrong!");

  if (user.otpLockedUntil && user.otpLockedUntil > Date.now()) {
    const minutesLeft = Math.ceil(
      (user.otpLockedUntil - Date.now()) / (60 * 1000)
    );
    throw new Error(
      `Too many invalid attempts. Please try again in ${minutesLeft} minutes.`
    );
  }

  if (!user.otp || !user.otpExpires)
    throw new Error("OTP expired! Please request a new one");
  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    user.otpAttempts += 1;
    if (user.otpAttempts >= 6)
      user.otpLockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lock
    await user.save();
    throw new Error("Invalid Credentials");
  }
  if (user.otpExpires < Date.now())
    throw new Error("OTP expired! Please request a new one");
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  user.otpLockedUntil = undefined;
  await User.updateOne(
    { _id: user._id },
    {
      $unset: { otp: "", otpExpires: "", otpAttempts: "", otpLockedUntil: "" },
      isVerified: true,
    }
  );
  return user;
};

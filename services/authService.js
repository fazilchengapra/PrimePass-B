const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { findOrCreateGoogleUser } = require("./oauth.service");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("./cryptoService");
const { generateAndSendOtp } = require("./otpService");
require("dotenv").config();

exports.loginUser = async (res, userData) => {
  // destructuring email and pass for simplify
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Email or password incorrect");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Email or password incorrect");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
};

exports.verifyGoogleUser = async (code) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );

  const { tokens } = await client.getToken(code);
  const idToken = tokens.id_token;

  // 2. Verify the ID token to get user details
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) throw new Error("Invalid token payload");
  const user = await findOrCreateGoogleUser(payload);
  return user;
};

exports.registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  let user = await User.findOne({ $or: [{ email }, { username }] });
  if (user && user.isVerified) {
    const field = user.email === email ? "Email" : "Username";
    throw new Error(`This ${field} already in use`);
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
  if(user.otpLockedUntil && user.otpLockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.otpLockedUntil - Date.now()) / (60 * 1000));
    throw new Error(`Too many invalid attempts. Please try again in ${minutesLeft} minutes.`);
  }
  if (!user.otp || !user.otpExpires)
    throw new Error("OTP expired! Please request a new one");
  const isMatch = await bcrypt.compare(otp, user.otp);

  if (!isMatch) {
    user.otpAttempts += 1;
    if(user.otpAttempts >= 6) user.otpLockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lock
    await user.save();
    throw new Error("Invalid Credentials")
  }
  if (user.otpExpires < Date.now())
    throw new Error("OTP expired! Please request a new one");
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  user.otpLockedUntil = undefined;
  await user.save();
  return user
};

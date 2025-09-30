const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { findOrCreateGoogleUser } = require("./oauth.service");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.loginUser = async (res, user) => {
  // destructuring email and pass for simplify
  const { email, password } = user;

  const userExist = await User.findOne({ email });
  if (!userExist) throw new Error("Email or password incorrect");

  const isMatch = await bcrypt.compare(password, userExist.password);
  if (!isMatch) throw new Error("Email or password incorrect");

  const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
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
      user: { _id: userExist._id, username: userExist.username, email: userExist.email },
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

  const userExist = await User.findOne({ $or: [{ email }, { username }] });
  if (userExist) {
    const field = userExist.email === email ? "Email" : "Username";
    throw new Error(`This ${field} already in use`);
  }

  const hashedPass = await bcrypt.hash(password, 10);

  return await User.create({ username, email, password: hashedPass, role });
};

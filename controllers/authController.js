const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");
const sendResponse = require("../utils/sendResponse");
const { loginUser, verifyGoogleUser } = require("../services/authService");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email, password, role } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "This Email already exists" });

    const user = await User.create({ username, email, password, role });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    //validation
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // destructuring email and pass for simplify
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Email or password incorrect" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Email or password incorrect" });

    loginUser(res, user)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.isMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.json({ loggedIn: false });
    }

    // Fetch user (exclude password)
    const user = await User.findById(req.user.id).select(
      "_id username email role"
    );

    if (!user) {
      return res.json({ loggedIn: false });
    }

    return res.json({
      loggedIn: true,
      user,
    });
  } catch (err) {
    console.error("isMe error:", err);
    return res.status(500).json({ loggedIn: false, message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only https in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};

exports.googleOauth = async (req, res) => {
  try {
    const { code } = req.body;
    const user =await verifyGoogleUser(code);
    loginUser(res, user);
  } catch (error) {
    // console.log("error:", error);
    sendResponse(res, 400, "Something went wrong!", false)
  }
};

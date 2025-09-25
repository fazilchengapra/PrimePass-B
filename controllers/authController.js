const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

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

    const token = generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", // safer in dev, can also use "Strict"
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { _id: user._id, username: user.username, email: user.email },
      });
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
    sameSite: "strict",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};

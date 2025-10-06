const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

exports.sendAuthResponse = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res
    .cookie("token", token, this.cookieOptions)
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

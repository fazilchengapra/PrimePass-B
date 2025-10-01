const { verifyGoogleUser } = require("../../services/authService");
const sendResponse = require("../../utils/sendResponse");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.googleOauth = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await verifyGoogleUser(code);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
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
  } catch (error) {
    // console.log("error:", error);
    sendResponse(res, 400, "Something went wrong!", false);
  }
};

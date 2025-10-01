const jwt = require("jsonwebtoken");
const {
  registerUser,
  registrationOtpVerification,
} = require("../../services/authService");
const sendResponse = require("../../utils/sendResponse");
const {
  registerSchema,
  otpSchema,
} = require("../../validations/auth.validation");

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return sendResponse(res, 400, "Something went wrong!", false);

    await registerUser(req.body);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.message.includes("already in use")) {
      return sendResponse(res, 409, err.message, false);
    }
    console.error("Registration error: ", err);
    return sendResponse(res, 500, "Registration failed", false);
  }
};

exports.verifyRegistrationOtp = async (req, res) => {
  try {
    const { error } = otpSchema.validate(req.body);
    if (error) return sendResponse(res, 400, "Invalid Credentials", false);
    const { email, otp } = req.body;

    const user = await registrationOtpVerification(email, otp);
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
    if (error.message.includes("Invalid Credentials")) {
      return sendResponse(res, 401, error.message, false);
    }
    if (error.message.includes("Something went wrong")) {
      return sendResponse(res, 500, error.message, false);
    }
    if (error.message.includes("Too many invalid attempts")) {
      return sendResponse(res, 429, error.message, false);
    }
    console.error("OTP Verification error: ", error);
    return sendResponse(res, 500, "OTP Verification failed", false);
  }
};

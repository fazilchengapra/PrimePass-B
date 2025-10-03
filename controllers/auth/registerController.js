const jwt = require("jsonwebtoken");
const sendResponse = require("../../utils/sendResponse");
const {
  registerSchema,
  otpSchema,
} = require("../../validations/auth.validation");
const { sendAuthResponse } = require("../../utils/jwtHelper");
const { registerUser, registrationOtpVerification } = require("../../services/auth");

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
    sendAuthResponse(res, user);
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

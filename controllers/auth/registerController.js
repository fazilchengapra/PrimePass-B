const { registerUser } = require("../../services/authService");
const sendResponse = require("../../utils/sendResponse");
const { registerSchema } = require("../../validations/auth.validation");

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
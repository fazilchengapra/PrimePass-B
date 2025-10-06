const {
  forgotUserPass,
  resetUserPass,
} = require("../../services/auth/passwordService");
const sendResponse = require("../../utils/sendResponse");
const {
  forgotPasswordSchema,
  loginSchema,
} = require("../../validations/auth.validation");

exports.forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return sendResponse(res, 400, "Something went wrong!", false);
    const { email } = req.body;
    await forgotUserPass(email);
    return sendResponse(
      res,
      200,
      "Password reset link sent to your email",
      true
    );
  } catch (error) {
    if (error.message.includes("Something went wrong"))
      return sendResponse(res, 400, error.message, false);
    console.error("Forgot Password error: ", error);
    return sendResponse(res, 500, "Forgot Password failed", false);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email } = req.query;
    const { newPassword } = req.body;
    if (!token || !email || !newPassword)
      return sendResponse(res, 400, "Oops! Something went wrong!", false);
    
    const { error } = loginSchema.validate({ email, password: newPassword });
    if (error) return sendResponse(res, 400, "Something went wrong!", false);
    
    await resetUserPass(email, newPassword, token);

    return sendResponse(res, 200, "Password reset successful", true);
  } catch (error) {
    if (error.message.includes("wrong!"))
      return sendResponse(res, 400, error.message, false);
    console.error("Reset Password error: ", error);
    return sendResponse(res, 500, "Reset Password failed", false);
  }
};

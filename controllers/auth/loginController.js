const { loginUser } = require("../../services/auth");
const sendResponse = require("../../utils/sendResponse");
const { loginSchema } = require("../../validations/auth.validation");

exports.login = async (req, res) => {
  try {
    //validation
    const { error } = loginSchema.validate(req.body);
    if (error) return sendResponse(res, 400, "Something went wrong!", false);

    await loginUser(res, req.body);
  } catch (err) {
    if(err.message.includes("incorrect")){
      return sendResponse(res, 401, err.message, false)
    }
    console.error("Login error: ", err);
    return sendResponse(res, 500, "Login failed", false);
  }
};

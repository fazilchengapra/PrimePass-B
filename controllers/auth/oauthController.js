const { verifyGoogleUser, loginUser } = require("../../services/authService");
const sendResponse = require("../../utils/sendResponse");

exports.googleOauth = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await verifyGoogleUser(code);
    loginUser(res, user);
  } catch (error) {
    // console.log("error:", error);
    sendResponse(res, 400, "Something went wrong!", false);
  }
};

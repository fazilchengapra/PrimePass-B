const { verifyGoogleUser } = require("../../services/auth");
const { sendAuthResponse } = require("../../utils/jwtHelper");
const sendResponse = require("../../utils/sendResponse");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.googleOauth = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await verifyGoogleUser(code);
    sendAuthResponse(res, user)
  } catch (error) {
    // console.log("error:", error);
    sendResponse(res, 400, "Something went wrong!", false);
  }
};

const { registerUser, registrationOtpVerification, loginUser } = require("./authService");
const { verifyGoogleUser } = require("./googleAuthService");

module.exports = {
    registerUser,
    registrationOtpVerification,
    loginUser,
    verifyGoogleUser
}
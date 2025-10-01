const { login } = require("./loginController")
const { logout } = require("./logoutController")
const { googleOauth } = require("./oauthController")
const { register, verifyRegistrationOtp } = require("./registerController")
const { isMe } = require("./sessionController")


module.exports = {
    login,
    logout,
    register,
    googleOauth,
    isMe,
    verifyRegistrationOtp
}
const { login } = require("./loginController")
const { logout } = require("./logoutController")
const { googleOauth } = require("./oauthController")
const { forgotPassword, resetPassword } = require("./passwordController")
const { register, verifyRegistrationOtp } = require("./registerController")
const { isMe } = require("./sessionController")


module.exports = {
    login,
    logout,
    register,
    googleOauth,
    isMe,
    verifyRegistrationOtp,
    forgotPassword,
    resetPassword
}
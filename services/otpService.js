const User = require("../models/User")
const { hashPassword } = require("./cryptoService")

exports.generateAndSendOtp= async(user, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000)
    const saltOtp = await hashPassword(otp)
    await User.updateOne({_id: user}, {otp:saltOtp, otpExpires})
    console.log(`Sending OTP ${otp} to email ${email}`)
}
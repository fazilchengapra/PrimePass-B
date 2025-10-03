const User = require("../models/User");
const notificationQueue = require("../queues/notificationQueue");
const { hashPassword } = require("./cryptoService");

exports.generateAndSendOtp = async (user, email, username) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
  const saltOtp = await hashPassword(otp);
  await User.updateOne({ _id: user }, { otp: saltOtp, otpExpires });
  await notificationQueue.add(
    "emailVerification",
    { email, username, otp },
    {
      attempts: 3,
      backoff: 5000,
      priority: 1,
    }
  );
};

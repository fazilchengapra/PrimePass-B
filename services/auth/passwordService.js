const User = require("../../models/User");
const notificationQueue = require("../../queues/notificationQueue");
const {
  generateToken,
  hashedToken,
  hashPassword,
} = require("../cryptoService");
require("dotenv").config();

exports.forgotUserPass = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Something went wrong!");
  if (!user.isVerified) throw new Error("Something went wrong!");
  const { resetToken, hashedToken } = generateToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  await user.save();
  await notificationQueue.add(
    "resetPassword",
    {
      email,
      name: user.username,
      resetUrl: `${process.env.URL}/reset-password?token=${resetToken}&email=${email}`,
    },
    {
      attempts: 3,
      backoff: 5000,
      priority: 1,
    }
  );
};

exports.resetUserPass = async (email, password, token) => {
  const tokenHash = hashedToken(token);

  const user = await User.findOne({
    email,
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Something went wrong!");
  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

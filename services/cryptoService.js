const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;
const crypto = require("crypto")

exports.hashPassword = async (pass) => {
  return await bcrypt.hash(pass, SALT_ROUNDS);
};
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.generateToken = (length = 32) => {
  const resetToken = crypto.randomBytes(length).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  return {resetToken, hashedToken}
}

exports.hashedToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}

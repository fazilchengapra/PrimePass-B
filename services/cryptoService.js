const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

exports.hashPassword = async (pass) => {
  return await bcrypt.hash(pass, SALT_ROUNDS);
};
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

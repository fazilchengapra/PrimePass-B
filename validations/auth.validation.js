const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required(),
  role: Joi.string().trim().valid('customer', 'theaterOwner').default('customer')
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema
};

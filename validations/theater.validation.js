const Joi = require("joi");

const theaterValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  location: Joi.object({
    address: Joi.string().trim().min(5).max(200).required(),
    city: Joi.string().trim().min(2).max(50).required(),
    state: Joi.string().trim().min(2).max(50).required(),
    pinCode: Joi.number().integer().min(100000).max(999999).required(),
  }),
});

module.exports = {theaterValidationSchema}

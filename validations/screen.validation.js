const Joi = require("joi");

const screenValidation = Joi.object({
  theaterId: Joi.string().trim().length(24).hex().required(),
  screenNumber: Joi.number().min(1).max(100).required(),
  name: Joi.string().trim().min(3).max(50).required(),
  totalSeats: Joi.number().min(20).max(500).required(),
});


module.exports = {screenValidation}
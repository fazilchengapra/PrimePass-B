const Joi = require("joi");

const screenValidation = Joi.object({
  theaterId: Joi.string().trim().length(24).hex().required(),
  screenNumber: Joi.number().min(1).max(100).required(),
  name: Joi.string().trim().min(3).max(50).required(),
  totalSeats: Joi.number().min(20).max(500).required(),
  seatLayout: Joi.array()
    .min(4)
    .items(
      Joi.object({
        seatNumber: Joi.string().trim().min(2).max(3).required(),
        row: Joi.string().trim().length(1).required(),
        type: Joi.string()
          .trim()
          .valid("Regular", "Premium")
          .default("Regular"),
      })
    )
    .required(),
});

module.exports = { screenValidation };

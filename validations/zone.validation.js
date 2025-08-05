const Joi = require("joi");

const zoneValidation = Joi.object({
  screenCode: Joi.string().trim().min(9).max(18).required(),
  name: Joi.string().trim().min(3).max(100).required(),
  price: Joi.number().min(0).required(),
  rows: Joi.array().items(Joi.string().trim().length(1)).min(1).required(),
  maxSeatsPerRow: Joi.number().integer().min(1).required(),
  seatPattern: Joi.object()
    .pattern(
      Joi.string(), // Dynamic row labels like "A", "B", "C"
      Joi.array().items(
        Joi.alternatives().try(Joi.string(), Joi.valid(null)) // Allow seat string or null (gap)
      )
    )
    .required(),
});

module.exports = zoneValidation;

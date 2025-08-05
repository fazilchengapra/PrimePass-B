const Joi = require("joi");

const seatValidation = Joi.object({
  showId: Joi.string().trim().length(24).hex().required(),
  theaterCode: Joi.string().trim().min(5).max(10).required(),
  screenCode: Joi.string().trim().min(9).max(18).required(),
  zoneCode: Joi.string().trim().min(9).required(),
  seatNumber: Joi.string()
    .trim()
    .pattern(/^[A-Z]\d{1,2}$/)
    .required(),
  row: Joi.string().trim().length(1).required(),
  type: Joi.string().trim().valid("Premium", "Regular").default("Regular"),
  status: Joi.string()
    .trim()
    .valid("available", "booked", "held")
    .default("available"),
    gridSeatNum: Joi.number().integer().min(0).required(),
  lockedBy: Joi.string().trim().length(24).hex().allow(null).default(null),
  lockedAt: Joi.date().allow(null).default(null),
  version: Joi.number().integer().min(0).default(0),
  bookedBy: Joi.string().trim().length(24).hex().default(null),
  bookedAt: Joi.date().default(null),
});

module.exports = seatValidation;

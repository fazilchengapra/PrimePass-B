const Joi = require("joi");
const mongoose = require("mongoose");

// Custom validator for ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const pendingBookingValidation = Joi.object({
  // User & Show
  userId: Joi.string().custom(objectId).required(),
  showId: Joi.string().custom(objectId).required(),

  // Movie & Venue
  movieTitle: Joi.string().required(),
  posterUrl: Joi.string().optional(),
  theaterName: Joi.string().optional(),
  showDate: Joi.date().required(),

  // Seats
  numberOfSeats: Joi.number().integer().min(1).required(),
  childSeats: Joi.number().integer().min(0).default(0),
  seats: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().custom(objectId).required(),
        row: Joi.string().required(),
        number: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  // Flattened seatIds for Mongo unique index
  seatIds: Joi.array()
    .items(Joi.string().custom(objectId))
    .min(1)
    .required(),

  // Zone-wise details
  zoneDetails: Joi.array()
    .items(
      Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        seats: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
        total: Joi.number().positive().required(),
      })
    )
    .optional(),

  // Pricing
  taxPercentage: Joi.number().min(0).max(100).default(18),
  totalAmount: Joi.number().positive().required(),
  currency: Joi.string().valid("INR", "USD", "EUR").default("INR"),
});

module.exports = pendingBookingValidation;

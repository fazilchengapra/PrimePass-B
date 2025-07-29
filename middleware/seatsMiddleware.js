const sendResponse = require("../utils/sendResponse");
const seatValidation = require("../validations/seat.validation");

const seatsMiddleware = (req, res, next) => {
  const { error } = seatValidation.validate(req.body);

  if (error)
    return sendResponse(
      res,
      400,
      error.details.map((e) => e.message),
      false
    );
  return next();
};

module.exports = seatsMiddleware;

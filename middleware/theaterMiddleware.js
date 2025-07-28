const sendResponse = require("../utils/sendResponse");
const {
  theaterValidationSchema,
} = require("../validations/theater.validation");

const theaterValidation = (req, res, next) => {
  const { error } = theaterValidationSchema.validate(req.body);

  if (error) {
    return sendResponse(
      res,
      400,
      error.details.map((e) => e.message)
    );
  }

  next();
};

module.exports = { theaterValidation };

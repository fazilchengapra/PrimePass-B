const sendResponse = require("../utils/sendResponse");
const showValidation = require("../validations/show.validation");

const showMiddleware = (req, res, next) => {
  const { error } = showValidation.validate(req.body);
  if (error)
    return sendResponse(
      res,
      400,
      error.details.map((e) => e.message),
      false
    );
  return next();
};

module.exports = showMiddleware

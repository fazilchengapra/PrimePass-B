const sendResponse = require("../utils/sendResponse");
const { screenValidation } = require("../validations/screen.validation");

const screenMiddleware = (req, res, next) => {
  const { error } = screenValidation.validate(req.body);

  if (error)
    return sendResponse(
      res,
      400,
      error.details.map((err) => err.message)
    );
  next();
};

module.exports = screenMiddleware;

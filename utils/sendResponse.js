const sendResponse = (res, statusCode, message, status, data = null) => {
  return res.status(statusCode).json({ message, status, data });
};

module.exports = sendResponse
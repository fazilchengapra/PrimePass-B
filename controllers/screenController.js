const Screen = require("../models/Screen");
const generateScreenId = require("../utils/generateScreenId");
const isValidObjectId = require("../utils/isValidObjectId");
const sendResponse = require("../utils/sendResponse");

exports.createScreen = async (req, res) => {
  try {
    const { theaterId, screenNumber, name, totalSeats } = req.body;
    const screenCode = await generateScreenId(theaterId);

    const screen = await Screen.create({
      theaterId,
      screenNumber,
      name,
      totalSeats,
      screenCode,
    });
    return sendResponse(res, 200, "Screen added success!", true, screen);
  } catch (error) {
    return sendResponse(res, 400, error.message, false);
  }
};

exports.getScreenById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return sendResponse(res, 400, "Invalid screen ID", false);

    const screen = await Screen.findById(id);
    if (!screen) return sendResponse(res, 401, "Screen not found!", false);

    return sendResponse(res, 200, "Screen fetched success!", true, screen);
  } catch (error) {
    return sendResponse(res, 400, error.message, false);
  }
};

exports.getScreenByTheaterId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendResponse(res, 400, "theater ID not found!", false);
    if (!isValidObjectId(id))
      return sendResponse(res, 400, "Invalid theater ID", false);

    const screens = await Screen.find({ theaterId: id });
    if (!screens) return sendResponse(res, 400, "Screen not found!", false);

    return sendResponse(res, 200, "Screens fetched success!", true, screens)
  } catch (error) {
    return sendResponse(res, 400, error.message, false);
  }
};

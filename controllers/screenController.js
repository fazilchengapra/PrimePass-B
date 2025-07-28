const Screen = require("../models/Screen");
const generateScreenId = require("../utils/generateScreenId");
const sendResponse = require("../utils/sendResponse");

exports.createScreen = async (req, res) => {
  try {
    const { theaterId, screenNumber, name, totalSeats } = req.body;
    const screenCode = await generateScreenId(theaterId );

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

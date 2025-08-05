const Screen = require("../models/Screen");
const Zone = require("../models/Zone");
const sendResponse = require("../utils/sendResponse");
const zoneValidation = require("../validations/zone.validation");

exports.createZone = async (req, res) => {
  try {
    const { error } = zoneValidation.validate(req.body);
    if (error) return sendResponse(res, 400, error.details[0].message, false);

    const screen = await Screen.findOne({ screenCode: req.body.screenCode });
    if (!screen) return sendResponse(res, 404, "Screen not found!", false);

    req.body.zoneCode = screen.screenCode + "-" + req.body.name;
    const newZone = await Zone.create(req.body);
    await screen.save();
    return sendResponse(res, 200, "Zone created successfully!", true, newZone);
  } catch (error) {
    return sendResponse(res, 500, error.message, false);
  }
};



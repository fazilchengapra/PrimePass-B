const Theater = require("../models/Theater");
const checkDuplicateTheater = require("../utils/checkDuplicateTheater");
const generateTheaterCode = require("../utils/generateTheaterCode");
const sendResponse = require("../utils/sendResponse");

// register theater!
exports.createTheater = async (req, res) => {
  try {
    const { name, location } = req.body;

    // fetching same name, address, and city theater
    const existingTheater = await checkDuplicateTheater({
      name,
      address: location.address,
      city: location.city,
    });

    // if theater exist
    if (existingTheater) {
      return sendResponse(
        res,
        400,
        "Theater already exist in this address and city.",
        false
      );
    }

    // generate new theater code via util function
    const theaterCode = await generateTheaterCode()

    // create and save theater!
    const newTheater = await Theater.create({ name, location, theaterCode });
    newTheater.save();

    return sendResponse(res, 200, "Theater created success", true, newTheater);
  } catch (error) {
    return sendResponse(res, 400, error.message, false);
  }
};

exports.deleteTheater = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Theater.findByIdAndDelete(id);

    return sendResponse(res, 200, "Theater Deleted Success!", true);
  } catch (error) {
    return sendResponse(res, 400, error.message, false);
  }
};

exports.updateTheater = async (req, res) => {
  try {
    const { id } = req.params;

    const updateTheater = await Theater.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateTheater)
      return sendResponse(res, 404, "Theater not found!", false);
    return sendResponse(res, 200, "Theater updated success!", true, updateTheater)
  } catch (error) {
    return sendResponse(res, 400, error.message, false)
  }
};

exports.getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    
    return sendResponse(res, 200, "Theaters fetched success!", true, theaters)
  } catch (error) {
    return sendResponse(res, 400, error.message, false);
  }
};

exports.getTheaterById = async (req, res) => {
  try {
    const { id } = req.params;

    const theater = await Theater.findById(id);
    if (!theater)
      return sendResponse(res, 404, "Theater not found!", false)
    return sendResponse(res, 200, "Theater fetched success!", true, theater)
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const isValidDate = require("../utils/isValidDate");
const sendResponse = require("../utils/sendResponse");

exports.createShow = async (req, res) => {
  try {
    const { theaterCode, screenCode, startTime, endTime } = req.body;
    const screen = await Screen.findOne({ screenCode }).populate(
      "theaterId seatLayout"
    );
    if (!screen) return sendResponse(res, 404, "Screen not found!", false);

    const thisScreenTheater = screen.theaterId.theaterCode;
    if (theaterCode !== thisScreenTheater)
      return sendResponse(res, 400, "Unmatched theater!", false);

    const [isValid, dateError] = isValidDate(startTime, endTime);
    if (!isValid) return sendResponse(res, 400, dateError, false);

    const show = await Show.create(req.body);

    const seatLayout = screen.seatLayout;
    if (!seatLayout)
      return sendResponse(
        res,
        400,
        "No seat layout defined this screen!",
        false
      );

    const seatsToInsert = seatLayout.map((seat) => ({
      showId: show._id,
      theaterCode,
      screenCode,
      seatNumber: seat.seatNumber,
      row: seat.row,
      type: seat.type,
    }));
    await Seat.insertMany(seatsToInsert);
    return sendResponse(res, 200, "Show and seats created!", true, show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getShowByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movieId, startTime: { $gt: new Date() } });

    if (shows.length <= 0)
      return sendResponse(res, 404, "Shows not found in this movie", false);
    return sendResponse(res, 200, "Shows fetched success!", true, shows);
  } catch (error) {
    return sendResponse(res, 500, error.message, false);
  }
};

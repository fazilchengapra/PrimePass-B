const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const Zone = require("../models/Zone");
const isValidDate = require("../utils/isValidDate");
const sendResponse = require("../utils/sendResponse");

exports.createShow = async (req, res) => {
  try {
    const { theaterCode, screenCode, startTime, endTime, zoneCode } = req.body;
    if (!theaterCode || !screenCode || !startTime || !endTime || !zoneCode)
      return sendResponse(res, 400, "All fields are required!", false);

    const thisZone = await Zone.findOne({ screenCode, zoneCode });

    if (!thisZone) return sendResponse(res, 404, "Zone not found!", false);
    if (thisZone.screenCode !== screenCode)
      return sendResponse(res, 400, "Unmatched screen code!", false);

    const [isValid, dateError] = isValidDate(startTime, endTime);
    if (!isValid) return sendResponse(res, 400, dateError, false);

    // ✅ Create the show first
    const show = await Show.create(req.body);

    const seats = [];

    // ✅ Loop through each row in the zone
    for (const row of thisZone.rows) {
      const pattern = thisZone.seatPattern.get(row); // because seatPattern is a Map
      if (!pattern) continue;

      for (let i = 0; i < pattern.length; i++) {
        const seatNumber = pattern[i];

        // Skip gap positions
        if (seatNumber === null) continue;

        seats.push({
          showId: show._id,
          theaterCode,
          screenCode,
          zoneCode,
          seatNumber,
          row,
          gridSeatNum: i+1,
          type: thisZone.type || "Regular", // Default to Regular if not specified
        });
      }
    }

    // ✅ Insert generated seats
    await Seat.insertMany(seats);

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

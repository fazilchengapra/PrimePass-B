const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const Zone = require("../models/Zone");
const isValidDate = require("../utils/isValidDate");
const sendResponse = require("../utils/sendResponse");

exports.createShow = async (req, res) => {
  try {
    const { theaterCode, screenCode, startTime, endTime, movieId, zoneCodes } =
      req.body;

    // ✅ Input validation
    if (
      !theaterCode ||
      !screenCode ||
      !startTime ||
      !endTime ||
      !movieId ||
      !zoneCodes ||
      !Array.isArray(zoneCodes) ||
      zoneCodes.length === 0
    ) {
      return sendResponse(
        res,
        400,
        "All fields (including zoneCodes[]) are required!",
        false
      );
    }

    const [isValid, dateError] = isValidDate(startTime, endTime);
    if (!isValid) return sendResponse(res, 400, dateError, false);

    // ✅ Fetch all zones for this screen
    const zones = await Zone.find({
      screenCode,
      zoneCode: { $in: zoneCodes },
    });

    if (zones.length !== zoneCodes.length) {
      return sendResponse(
        res,
        404,
        "One or more zoneCodes are invalid for the given screen.",
        false
      );
    }

    // ✅ Create the show
    const show = await Show.create({
      movieId,
      theaterCode,
      screenCode,
      startTime,
      endTime,
      zoneCodes,
    });

    const seats = [];

    for (const zone of zones) {
      for (const row of zone.rows) {
        const pattern = zone.seatPattern.get(row);
        if (!pattern) continue;

        for (let i = 0; i < pattern.length; i++) {
          const seatNumber = pattern[i];
          if (seatNumber === null) continue;

          seats.push({
            showId: show._id,
            theaterCode,
            screenCode,
            zoneCode: zone.zoneCode,
            seatNumber,
            row,
            gridSeatNum: i + 1,
            type: zone.type || "Regular",
          });
        }
      }
    }

    // ✅ Bulk insert seats
    await Seat.insertMany(seats);

    return sendResponse(
      res,
      200,
      "Show and seats created successfully!",
      true,
      {
        showId: show._id,
        seatCount: seats.length,
      }
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || "Internal server error",
      false
    );
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

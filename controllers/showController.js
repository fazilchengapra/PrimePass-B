const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const Zone = require("../models/Zone");
const isValidDate = require("../utils/isValidDate");
const sendResponse = require("../utils/sendResponse");

exports.createShow = async (req, res) => {
  try {
    const { theaterId, screenCode, startTime, endTime, movieId, zoneCodes } =
      req.body;

    // ✅ Input validation
    if (
      !theaterId ||
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

    console.log('hey i am here');
    

    // ✅ Create the show
    const show = await Show.create({
      movieId,
      theaterId,
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
            theaterId,
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

    const now = new Date();

    // Start and end of this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Fetch only current month shows
    const shows = await Show.find({
      movieId,
      startTime: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate("theaterId", "name location");

    if (!shows || shows.length === 0) {
      return sendResponse(res, 404, "No shows found for this movie in current month", false);
    }

    // Group by theater
    const theaterMap = {};
    const datesMap = {}; // month -> days

    shows.forEach(show => {
      const theater = show.theaterId;

      if (!theaterMap[theater._id]) {
        theaterMap[theater._id] = {
          theaterId: theater._id,
          name: theater.name,
          location: theater.location,
          shows: []
        };
      }

      theaterMap[theater._id].shows.push({
        showId: show._id,
        startTime: show.startTime,
        endTime: show.endTime,
        screenCode: show.screenCode
      });

      // Collect dates by month
      const d = new Date(show.startTime);
      const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const day = d.getDate().toString().padStart(2, "0");
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD

      if (!datesMap[month]) {
        datesMap[month] = new Map();
      }

      datesMap[month].set(dateKey, { day, date: dateKey });
    });

    // Convert to desired structure
    const theaters = Object.values(theaterMap);

    const dates = Object.keys(datesMap).map(month => ({
      month,
      upcoming: Array.from(datesMap[month].values()).sort((a, b) => new Date(a.date) - new Date(b.date))
    }));

    return sendResponse(res, 200, "Shows fetched success!", true, { theaters, dates });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, error.message, false);
    
  }
};


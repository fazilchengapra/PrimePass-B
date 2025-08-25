const Seat = require("../models/Seat");
const Show = require("../models/Show");
const Zone = require("../models/Zone");
const sendResponse = require("../utils/sendResponse");

// Helper function to map seat status to numeric value
function mapSeatStatus(status) {
  switch (status) {
    case "available":
      return "1";
    case "locked":
      return "1000";
    case "booked":
      return "1001";
    default:
      return "0";
  }
}

// Helper to extract numeric part from seat number like A1 => 1
function extractSeatId(seatNumber) {
  const match = seatNumber.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

exports.getSeatLayout = async (req, res) => {
  try {
    const { showId } = req.params;
    if (!showId) return sendResponse(res, 400, "Show ID is required", false);

    const thisShow = await Show.findById(showId);
    if (!thisShow) return sendResponse(res, 404, "Show not found", false);

    const seats = await Seat.find({ showId }).sort({ row: 1, gridSeatNum: 1 });
    if (!seats.length)
      return sendResponse(res, 404, "No seats found for this show", false);

    const zones = await Zone.find({ screenCode: thisShow.screenCode });
    const zoneMap = new Map();
    for (const zone of zones) {
      zoneMap.set(zone.zoneCode, {
        name: zone.name,
        price: zone.price,
      });
    }

    let globalMinSeatId = Infinity;
    let globalMaxSeatId = -Infinity;

    const zoneAreaMap = {}; // zoneCode → objArea

    for (const seat of seats) {
      const {
        zoneCode,
        row,
        gridSeatNum,
        seatNumber,
        status,
      } = seat;

      const displaySeatNumber = seatNumber.toString();
      const seatId = extractSeatId(seatNumber);

      if (seatId !== null) {
        globalMinSeatId = Math.min(globalMinSeatId, seatId);
        globalMaxSeatId = Math.max(globalMaxSeatId, seatId);
      }

      const zoneInfo = zoneMap.get(zoneCode) || {
        name: zoneCode,
        price: 0,
      };

      // Initialize zone container
      if (!zoneAreaMap[zoneCode]) {
        zoneAreaMap[zoneCode] = {
          AreaNum: Object.keys(zoneAreaMap).length + 1,
          AreaDesc: zoneInfo.name,
          AreaCode: zoneCode,
          AreaPrice: zoneInfo.price,
          HasCurrentOrder: true,
          objRow: [],
          _rowMap: new Map(), // Temporary map to group rows
        };
      }

      const zoneArea = zoneAreaMap[zoneCode];

      // Initialize row container
      if (!zoneArea._rowMap.has(row)) {
        const newRow = {
          GridRowId: zoneArea.objRow.length + 1,
          PhyRowId: row,
          objSeat: [],
        };
        zoneArea._rowMap.set(row, newRow);
        zoneArea.objRow.push(newRow);
      }

      const rowObj = zoneArea._rowMap.get(row);

      // Push seat into the row
      rowObj.objSeat.push({
        GridSeatNum: gridSeatNum,
        SeatStatus: mapSeatStatus(status),
        seatNumber,
        displaySeatNumber,
      });
    }

    // Finalize output by removing temp maps
    const objArea = Object.values(zoneAreaMap).map((zone) => {
      delete zone._rowMap;
      return zone;
    });

    const seatLayout = {
      colAreas: {
        intMinSeatId: isFinite(globalMinSeatId) ? globalMinSeatId : null,
        intMaxSeatId: isFinite(globalMaxSeatId) ? globalMaxSeatId : null,
        Count: objArea.length,
        objArea,
      },
    };

    return sendResponse(res, 200, "Seat layout fetched successfully", true, {
      seatLayout,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, error.message, false);
  }
};


exports.lockSeats = async (req, res) => {
  try {
    const { seatIds, userId } = req.body;

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ error: "No seatIds provided" });
    }

    if (seatIds.length > 10) {
      return res.status(400).json({ error: "Max 10 seats allowed per user" });
    }

    // Lock seats if available
    const result = await Seat.updateMany(
      { _id: { $in: seatIds }, status: "available" },
      {
        $set: {
          status: "locked",
          lockedBy: userId,
          lockedAt: new Date(),
        },
        $inc: { version: 1 },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(400)
        .json({ error: "Some seats are already locked/booked" });
    }

    return res.json({ success: true, message: "Seats locked", result });
  } catch (err) {
    console.error("Error locking seats:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

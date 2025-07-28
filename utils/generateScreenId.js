/**
 * Generate screenId like TH0001-SC01 for a given theater
 * @param {String} theaterId
 * @returns {Promise<String>} - screenId
 */

const Screen = require("../models/Screen");
const Theater = require("../models/Theater");

const generateScreenId = async (theaterId) => {
  // Get theaterCode using theaterId
  const theater = await Theater.findById(theaterId).select("theaterCode");
  if (!theater) throw new Error("Theater not found!");

  const theaterCode = theater.theaterCode;

  // find the last screen for that theater
  const lastScreen = await Screen.find({ theaterId })
    .sort({ createdAt: -1 })
    .limit(1)
    .select("screenCode");
    
  let nextNumber = 1;

  if (lastScreen.length > 0 && lastScreen[0].screenCode) {
    const parts = lastScreen[0].screenCode.split("SC");

    const lastNum = parseInt(parts[1]);

    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1;
    }
  }

  const screenCode = "SC" + String(nextNumber).padStart(2, "0");

  return `${theaterCode}-${screenCode}`;
};

module.exports = generateScreenId;

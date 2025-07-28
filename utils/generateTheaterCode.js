const Theater = require("../models/Theater");

const generateTheaterCode = async () => {
  const lastTheater = await Theater.findOne()
    .sort({ createdAt: -1 })
    .select("theaterCode");

  let nextCode = "TH001";

  if (lastTheater && lastTheater.theaterCode) {
    const lastCodeNum = parseInt(lastTheater.theaterCode.replace("TH", ""));
    const nextCodeNum = lastCodeNum + 1;
    nextCode = "TH" + String(nextCodeNum).padStart(3, "0");
  }

  return nextCode;
};

module.exports = generateTheaterCode;

const mongoose = require("mongoose");

const showModel = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  screenCode: {
    type: String,
    required: true,
    ref: "Screen",
  },
  theaterCode: { type: String, required: true, ref: "Theater" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  language: { type: String },
  format: { type: String, enum: ["2D", "3D", "IMAX"], default: "2D" },
});

showModel.index({ theaterCode: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model("Show", showModel);

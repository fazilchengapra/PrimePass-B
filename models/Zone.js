const { default: mongoose } = require("mongoose");

const zoneModel = new mongoose.Schema({
  screenCode: { type: String, ref: "Screen", required: true },
  name: { type: String, required: true }, // e.g., "Platinum", "Gold"
  zoneCode: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  rows: [String], // e.g., ["A", "B", "C"]
  maxSeatsPerRow: { type: Number, required: true },
  seatPattern: {
    type: Map,
    of: [mongoose.Schema.Types.Mixed], // Array of strings or nulls
    default: {},
  },
});

zoneModel.index({ screenCode: 1, name: 1 }, { unique: true }); // Ensure unique zone per screen

module.exports = mongoose.model("Zone", zoneModel);

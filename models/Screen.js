const { default: mongoose } = require("mongoose");

const screenModel = new mongoose.Schema(
  {
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    screenCode: { type: String, required: true, unique: true },
    screenNumber: { type: Number, required: true },
    name: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    capacity: {
      regular: { type: Number, default: 0 },
      premium: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// prevent duplicate screenCode
screenModel.index({ theaterId: 1, screenCode: 1 }, { unique: true });

//prevent duplicate screen name and number
screenModel.index({ theaterId: 1, name: 1 }, { unique: true });
screenModel.index({ theaterId: 1, screenNumber: 1 }, { unique: true });

module.exports = mongoose.model("Screen", screenModel);

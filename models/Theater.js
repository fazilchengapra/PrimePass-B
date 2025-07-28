const { default: mongoose } = require("mongoose");

const theaterModel = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: Number, required: true },
    },
    theaterCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

theaterModel.index(
  { name: 1, "location.address": 1, "location.city": 1 },
  { unique: true }
);

module.exports = mongoose.model("Theater", theaterModel);

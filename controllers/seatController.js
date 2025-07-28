const Seats = require("../models/Seats");

exports.createSeat = async (req, res) => {
  try {
    const seat = await Seats.create(req.body);
    res.status(200).json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

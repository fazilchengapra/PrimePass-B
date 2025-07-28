const Show = require("../models/Show");

exports.createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(200).json(show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

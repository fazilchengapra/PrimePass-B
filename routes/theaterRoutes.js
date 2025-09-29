const express = require("express");
const router = express.Router();
const {
  createTheater,
  deleteTheater,
  updateTheater,
  getAllTheaters,
  getTheaterById,
} = require("../controllers/theaterController");
const { theaterValidation } = require("../middleware/theaterMiddleware");

router.post("/", theaterValidation, createTheater);
router.get("/", getAllTheaters);
router.get("/:id", getTheaterById);
router.put("/:id", theaterValidation, updateTheater);
router.delete("/:id", deleteTheater);

module.exports = router;

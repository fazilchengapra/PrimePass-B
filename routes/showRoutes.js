const express = require("express");
const { createShow, getShowByMovieId } = require("../controllers/showController");
const showMiddleware = require("../middleware/showMiddleware");
const router = express.Router();

router.post("/", showMiddleware, createShow);
router.get("/:movieId", getShowByMovieId)

module.exports = router;

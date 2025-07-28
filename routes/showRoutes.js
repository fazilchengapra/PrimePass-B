const express = require("express");
const { createShow } = require("../controllers/showController");
const router = express.Router();

router.post("/", createShow);

module.exports = router;
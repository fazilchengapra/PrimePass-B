const express = require("express");
const { createZone } = require("../controllers/zoneControllers");
const router = express.Router();

router.post("/", createZone);

module.exports = router;

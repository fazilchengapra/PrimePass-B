var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var authRouters = require("./routes/authRoutes");
var theaterRouters = require("./routes/theaterRoutes");
var screenRouters = require("./routes/screenRoutes");
var showRouters = require("./routes/showRoutes");
var zoneRouters = require("./routes/zoneRouter");
var seatsRouters = require("./routes/seatsRouter");
var pendingBookingRouters = require('./routes/pendingBookRoutes');
const authMiddleware = require("./middleware/authMiddleware");

var app = express();

// CORS (very important: place BEFORE any route or middleware)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200, // ✅ Fixes preflight in some browsers
  })
);

// Logger, parsers, static
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRouters);
app.use("/api/theaters", theaterRouters);
app.use("/api/screens", screenRouters);
app.use("/api/show", showRouters);
app.use("/api/zone", zoneRouters);
app.use("/api/seats", seatsRouters);
app.use('/api/pending-booking',authMiddleware, pendingBookingRouters)

// 404 error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// General error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

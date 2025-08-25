require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoURI = process.env.DB_URL;

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // 30s before timeout
      socketTimeoutMS: 60000,         // 1min socket timeout
      maxPoolSize: 10,                // limit connections
    });

    console.log("✅ MongoDB connected successfully");

    // Connection events
    mongoose.connection.on("connected", () => {
      console.log("🔗 MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected! Retrying...");
      setTimeout(() => {
        mongoose.connect(mongoURI).catch((err) =>
          console.error("Reconnect attempt failed:", err.message)
        );
      }, 5000);
    });

    // Prevent idle disconnects with a ping
    setInterval(async () => {
      try {
        await mongoose.connection.db.admin().ping();
        console.log("💓 MongoDB ping successful");
      } catch (err) {
        console.error("⚠️ MongoDB ping failed:", err.message);
      }
    }, 4 * 60 * 1000); // every 4 min

  } catch (err) {
    console.error("❌ Initial MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDb;

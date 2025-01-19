require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/adminRoutes");
const managerRoutes = require("./routes/managerRoutes");
const receptionistRoutes = require("./routes/receptionistRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

//const connectDB = require("./config/db");
const connectToDb = require("./config/db");

const app = express();
const allowedOrigins = [
  "https://indiga.atithikripa.com",
  "https://kanha.atithikripa.com",
  "https://amulyashri.atithikripa.com",
];
const dbConnections = {
  "https://indiga.atithikripa.com": process.env.DB_URL_INDIGA,
  "https://kanha.atithikripa.com": process.env.DB_URL_KANHA,
  "https://amulyashri.atithikripa.com": process.env.DB_URL_AMULYASHRI,
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

//connectDB();
// Middleware to connect to the correct database based on the full subdomain URL
app.use(async (req, res, next) => {
  try {
    const fullUrl = req.headers.host; // Example: "indiga.atithikripa.com"

    // Check if the full URL exists in the dbConnections map
    const uri = dbConnections[fullUrl];
    if (!uri) {
      throw new Error(`No database URL configured for subdomain: ${fullUrl}`);
    }

    // Connect to the database
    await connectToDb(uri);

    next();
  } catch (error) {
    console.error("Failed to connect to the database", error);
    res.status(500).send("Database connection error");
  }
});
app.use("/api/admin", adminRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api", bookingRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the Backend API");
});

module.exports = app;

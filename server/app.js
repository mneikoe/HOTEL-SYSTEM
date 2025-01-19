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

const connectDB = require("./config/db");
const connectToDb = require("./config/db");

const app = express();
const allowedOrigins = [
  "https://indiga.atithikripa.com",
  "https://kanha.atithikripa.com",
  "https://amulyashri.atithikripa.com",
];

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
app.use(async (req, res, next) => {
  try {
    const host = req.headers.host; // Example: "kanha.atithikripa.com"
    const subdomain = host.split(".")[0]; // Extract the subdomain (e.g., "kanha")

    // Connect to the database for the subdomain
    await connectToDb(subdomain);

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

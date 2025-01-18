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

const app = express();

app.use(cors({ origin: "https://indiga.atithikripa.com", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/receptionists", receptionistRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api", bookingRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Backend API');
});

module.exports = app;

// socketConfig.js for Bookings
const http = require("http");
const socketIo = require("socket.io");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const setupSocketForBookings = (app) => {
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected for bookings");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    const sendBookings = async () => {
      try {
        const bookings = await Booking.find().populate("roomId");
        io.emit("bookings", bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    // Booking CRUD operations
    socket.on("createBooking", async (data) => {
      try {
        const newBooking = new Booking(data);
        await newBooking.save();
        sendBookings();
      } catch (error) {
        console.error("Error creating booking:", error);
      }
    });

    socket.on("updateBooking", async (data) => {
      try {
        await Booking.findByIdAndUpdate(data.id, data);
        sendBookings();
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    });

    socket.on("deleteBooking", async (id) => {
      try {
        await Booking.findByIdAndDelete(id);
        sendBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    });

    sendBookings();
  });

  return server;
};

module.exports = setupSocketForBookings;

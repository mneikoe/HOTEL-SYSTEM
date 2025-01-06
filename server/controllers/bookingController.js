const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Create Booking
exports.createBooking = async (req, res) => {
  const { roomNumber, customerName, checkInDate, checkOutDate, createdBy } =
    req.body;

  try {
    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const shortType = room.type.substring(0, 3).toLowerCase();
    const bookingType =
      shortType === "eco"
        ? "Economic"
        : shortType === "del"
        ? "Deluxe"
        : shortType === "sup"
        ? "Super Deluxe"
        : "Larger than Life";

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const totalCost = room.price * Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const newBooking = new Booking({
      roomId: room._id,
      customerName,
      checkInDate,
      checkOutDate,
      status: "Booked",
      price: room.price,
      totalCost,
      createdBy,
      bookingType,
      bookingDate: new Date(),
    });

    room.status = "Booked";
    await room.save();
    await newBooking.save();

    req.app.get("socketio").emit("rooms", await Room.find());
    req.app
      .get("socketio")
      .emit("bookings", await Booking.find().populate("roomId"));

    res.status(201).json({
      message: "Room booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking room:", error);
    res.status(500).json({ error: "Error booking room" });
  }
};

// Delete Booking
// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("roomId");
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

// Update Booking
exports.updateBooking = async (req, res) => {
  const { roomId, customerName, checkInDate, checkOutDate, status, createdBy } =
    req.body;

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const room = await Room.findById(roomId);
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        roomId,
        customerName,
        checkInDate,
        checkOutDate,
        status,
        price: room ? room.price : booking.price,
        createdBy,
      },
      { new: true }
    );

    req.app
      .get("socketio")
      .emit("bookings", await Booking.find().populate("roomId"));

    res.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Error updating booking" });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    req.app
      .get("socketio")
      .emit("bookings", await Booking.find().populate("roomId"));

    res.json({
      message: "Booking deleted successfully",
      deletedAt: new Date(),
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Error deleting booking" });
  }
};

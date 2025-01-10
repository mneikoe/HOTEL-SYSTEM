// controllers/bookingController.js
/*const Booking = require("../models/Booking");
const Room = require("../models/Room");

class BookingController {
  // Helper method to check room availability
  async _isRoomAvailable(
    roomNumber,
    checkInDate,
    checkOutDate,
    excludeBookingId = null
  ) {
    const existingBooking = await Booking.findOne({
      roomNumber,
      bookingStatus: "confirmed",
      $or: [
        {
          checkInDate: { $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate },
        },
      ],
      ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
    });

    const room = await Room.findOne(roomNumber);
    return !existingBooking && room && !room.isBooked;
  }

  // Helper method to calculate total cost
  _calculateTotalCost(checkIn, checkOut, pricePerDay) {
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return days * pricePerDay;
  }

  // Create booking
  async createBooking(bookingData) {
    try {
      const { roomNumber, customerName, checkInDate, checkOutDate, createdBy } =
        bookingData;

      // Validate room existenceroomNumber
      const room = await Room.findOne({ roomNumber: bookingData.roomNumber });
      if (!room) {
        throw new Error("Room not found");
      }

      // Convert dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Validate dates
      if (checkIn >= checkOut) {
        throw new Error("Check-out date must be after check-in date");
      }

      if (checkIn < new Date()) {
        throw new Error("Check-in date cannot be in the past");
      }

      // Check availability
      const isAvailable = await this._isRoomAvailable(
        roomNumber,
        checkIn,
        checkOut
      );
      if (!isAvailable) {
        throw new Error("Room is not available for the selected dates");
      }

      // Calculate total cost
      const totalCost = this._calculateTotalCost(checkIn, checkOut, room.price);

      // Create booking
      const booking = new Booking({
        roomNumber = ,
        customerName,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        price: room.price,
        totalCost,
        createdBy,
      });

      // Update room status
      room.isBooked = true;
      await room.save();

      // Save booking
      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Booking creation failed: ${error.message}`);
    }
  }

  // Get all bookings with filters
  async getBookings(filters = {}) {
    try {
      let query = {};

      if (filters.customerName) {
        query.customerName = new RegExp(filters.customerName, "i");
      }
      if (filters.bookingStatus) {
        query.bookingStatus = filters.bookingStatus;
      }
      if (filters.startDate && filters.endDate) {
        query.checkInDate = { $gte: new Date(filters.startDate) };
        query.checkOutDate = { $lte: new Date(filters.endDate) };
      }

      return await Booking.find(query)
        .populate("roomId")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findById(bookingId).populate("roomId");
      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    } catch (error) {
      throw new Error(`Error fetching booking: ${error.message}`);
    }
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.bookingStatus !== "confirmed") {
        throw new Error("Cannot cancel a non-confirmed booking");
      }

      // Update booking status
      booking.bookingStatus = "cancelled";
      await booking.save();

      // Update room status
      const room = await Room.findById(booking.roomId);
      if (room) {
        room.isBooked = false;
        await room.save();
      }

      return booking;
    } catch (error) {
      throw new Error(`Booking cancellation failed: ${error.message}`);
    }
  }

  // Complete booking (checkout)
  async completeBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.bookingStatus !== "confirmed") {
        throw new Error("Cannot complete a non-confirmed booking");
      }

      // Update booking status
      booking.bookingStatus = "completed";
      await booking.save();

      // Update room status
      const room = await Room.findById(booking.roomId);
      if (room) {
        room.isBooked = false;
        await room.save();
      }

      return booking;
    } catch (error) {
      throw new Error(`Booking completion failed: ${error.message}`);
    }
  }
}

module.exports = new BookingController();*/
// controllers/bookingController.js
// controllers/bookingController.js
const Booking = require("../models/Booking");
const Room = require("../models/Room");

class BookingController {
  // Helper method to check room availability
  async _isRoomAvailable(
    roomNumber,
    checkInDate,
    checkOutDate,
    excludeBookingId = null
  ) {
    const existingBooking = await Booking.findOne({
      roomNumber,
      bookingStatus: "confirmed",
      $or: [
        {
          checkInDate: { $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate },
        },
      ],
      ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
    });

    const room = await Room.findOne({ roomNumber });
    return !existingBooking && room && !room.isBooked;
  }

  // Helper method to calculate total cost
  _calculateTotalCost(checkIn, checkOut, pricePerDay) {
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return days * pricePerDay;
  }

  // Create booking
  async createBooking(bookingData) {
    try {
      const { roomNumber, customerName, checkInDate, checkOutDate, createdBy } =
        bookingData;

      // Check room existence
      const room = await Room.findOne({ roomNumber });
      if (!room) {
        throw new Error("Room not found");
      }

      // Convert dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Validate dates
      if (checkIn >= checkOut) {
        throw new Error("Check-out date must be after check-in date");
      }

      if (checkIn < new Date()) {
        throw new Error("Check-in date cannot be in the past");
      }

      // Check availability
      const isAvailable = await this._isRoomAvailable(
        roomNumber,
        checkIn,
        checkOut
      );

      if (!isAvailable) {
        throw new Error("Room is not available for the selected dates");
      }

      // Calculate total cost
      const totalCost = this._calculateTotalCost(checkIn, checkOut, room.price);

      // Create booking
      const booking = new Booking({
        roomNumber,
        customerName,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        price: room.price,
        totalCost,
        createdBy,
      });

      // Update room status
      room.isBooked = true;
      await room.save();

      // Save booking
      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Booking creation failed: ${error.message}`);
    }
  }

  // Get all bookings with filters
  async getBookings(filters = {}) {
    try {
      let query = {};

      if (filters.customerName) {
        query.customerName = new RegExp(filters.customerName, "i");
      }
      if (filters.bookingStatus) {
        query.bookingStatus = filters.bookingStatus;
      }
      if (filters.startDate && filters.endDate) {
        query.checkInDate = { $gte: new Date(filters.startDate) };
        query.checkOutDate = { $lte: new Date(filters.endDate) };
      }

      return await Booking.find(query).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    } catch (error) {
      throw new Error(`Error fetching booking: ${error.message}`);
    }
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.bookingStatus !== "confirmed") {
        throw new Error("Cannot cancel a non-confirmed booking");
      }

      // Update booking status
      booking.bookingStatus = "cancelled";
      await booking.save();

      // Update room status
      const room = await Room.findOne({ roomNumber: booking.roomNumber });
      if (room) {
        room.isBooked = false;
        await room.save();
      }

      return booking;
    } catch (error) {
      throw new Error(`Booking cancellation failed: ${error.message}`);
    }
  }

  // Complete booking (checkout)
  async completeBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.bookingStatus !== "confirmed") {
        throw new Error("Cannot complete a non-confirmed booking");
      }

      // Update booking status
      booking.bookingStatus = "completed";
      await booking.save();

      // Update room status
      const room = await Room.findOne({ roomNumber: booking.roomNumber });
      if (room) {
        room.isBooked = false;
        await room.save();
      }

      return booking;
    } catch (error) {
      throw new Error(`Booking completion failed: ${error.message}`);
    }
  }
}

module.exports = new BookingController();

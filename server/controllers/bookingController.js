const Booking = require("../models/Booking");
const Room = require("../models/Room");

class BookingController {
  // Helper method to check room availability
  async _isRoomAvailable(
    roomNumber,
    checkInDateTime,
    checkOutDateTime,
    excludeBookingId = null
  ) {
    const existingBooking = await Booking.findOne({
      roomNumber,
      bookingStatus: "confirmed",
      $or: [
        {
          checkInDateTime: { $lte: checkOutDateTime },
          checkOutDateTime: { $gte: checkInDateTime },
        },
      ],
      ...(excludeBookingId && { _id: { $ne: excludeBookingId } }),
    });

    const room = await Room.findOne({ roomNumber });
    return !existingBooking && room && !room.isBooked;
  }

  // Helper method to calculate total cost
  _calculateTotalCost(checkIn, checkOut, pricePerDay) {
    const durationInHours = (checkOut - checkIn) / (1000 * 60 * 60);
    const pricePerHour = Math.ceil(pricePerDay / 24);

    if (durationInHours > 18) {
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return days * pricePerDay;
    } else {
      return durationInHours * pricePerHour;
    }
  }
  _calSellPrice(checkIn, checkOut, sellingPricePerday) {
    const durationInHours = (checkOut - checkIn) / (1000 * 60 * 60);
    const pricePerHour = Math.ceil(sellingPricePerday / 24);

    if (durationInHours > 18) {
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return days * sellingPricePerday;
    } else {
      return durationInHours * pricePerHour;
    }
  }

  _calBalance(checkIn, checkOut, sellingPricePerDay, advanceAmount) {
    const sellingPrice = this._calSellPrice(
      checkIn,
      checkOut,
      sellingPricePerDay
    );
    if (sellingPrice > advanceAmount) {
      const balance = sellingPrice - advanceAmount;
      return balance;
    } else {
      const balance = sellingPrice - advanceAmount;
      return balance;
    }
  }

  // Create booking
  async createBooking(bookingData) {
    try {
      const {
        roomNumber,
        customerName,
        customerPhone,
        customerAdharId,
        customerAddress,
        NumberOfPeople,
        checkInDateTime,
        checkOutDateTime,
        advanceAmount,
        sellingPricePerDay,
      } = bookingData;

      // Check room existence
      const room = await Room.findOne({ roomNumber });
      if (!room) {
        throw new Error("Room not found");
      }

      // Convert dates
      const checkIn = new Date(checkInDateTime);
      const checkOut = new Date(checkOutDateTime);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Validate dates
      if (checkIn >= checkOut) {
        throw new Error(
          "Check-out date and time must be after check-in date and time"
        );
      }

      if (checkIn === yesterday) {
        throw new Error("Check-in date and time cannot be in the past");
      }

      // Check availability
      const isAvailable = await this._isRoomAvailable(
        roomNumber,
        checkIn,
        checkOut
      );

      if (!isAvailable) {
        throw new Error(
          "Room is not available for the selected dates and times"
        );
      }

      // Calculate total cost
      const totalCost = this._calculateTotalCost(checkIn, checkOut, room.price);
      const sellingPrice = this._calSellPrice(
        checkIn,
        checkOut,
        sellingPricePerDay
      );

      const balanceAmount = this._calBalance(
        checkIn,
        checkOut,
        sellingPricePerDay,
        advanceAmount
      );

      // Create booking
      const booking = new Booking({
        roomNumber,
        customerName,
        customerPhone,
        customerAdharId,
        customerAddress,
        NumberOfPeople,
        checkInDateTime: checkIn,
        checkOutDateTime: checkOut,
        price: room.price,
        advanceAmount,
        totalCost,
        sellingPricePerDay,
        sellingPrice,

        balanceAmount,
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
      if (filters.customerPhone) {
        query.customerPhone = filters.customerPhone;
      }
      if (filters.bookingStatus) {
        query.bookingStatus = filters.bookingStatus;
      }
      if (filters.startDate && filters.endDate) {
        query.checkInDateTime = { $gte: new Date(filters.startDate) };
        query.checkOutDateTime = { $lte: new Date(filters.endDate) };
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

  async earlyCheckout(bookingId, newCheckoutDateTime) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.bookingStatus !== "confirmed") {
        throw new Error(
          "Cannot perform early checkout for a non-confirmed booking"
        );
      }

      const newCheckoutDate = new Date(newCheckoutDateTime);
      const checkInDate = new Date(booking.checkInDateTime);

      if (newCheckoutDate <= checkInDate) {
        throw new Error(
          "New checkout date and time must be after the check-in date and time"
        );
      }

      // Calculate new total cost
      const newTotalCost = this._calculateTotalCost(
        checkInDate,
        newCheckoutDate,
        booking.price
      );
      const newSellingPrice = this._calSellPrice(
        checkInDate,
        newCheckoutDate,
        booking.sellingPricePerDay
      );

      // Update booking details
      booking.balanceAmount = 0;
      booking.checkOutDateTime = newCheckoutDate;
      booking.totalCost = Math.ceil(newTotalCost);
      booking.sellingPrice = Math.ceil(newSellingPrice);

      booking.bookingStatus = "completed/ec";
      booking.paymentStatus = "settled";
      await booking.save();

      // Update room status
      const room = await Room.findOne({ roomNumber: booking.roomNumber });
      if (room) {
        room.isBooked = false;
        await room.save();
      }

      return {
        message: "Early checkout successful",
        booking,
      };
    } catch (error) {
      throw new Error(`Early checkout failed: ${error.message}`);
    }
  }
  async finalCheckout(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }
      // Update booking details

      booking.bookingStatus = "completed/fc";
      booking.paymentStatus = "paid";
      await booking.save();

      // Update room status
      const room = await Room.findOne({ roomNumber: booking.roomNumber });
      if (room) {
        room.isBooked = false;
        await room.save();
      }

      return {
        message: "Final checkout successful",
        booking,
      };
    } catch (error) {
      throw new Error(`Final checkout failed: ${error.message}`);
    }
  }
}

module.exports = new BookingController();

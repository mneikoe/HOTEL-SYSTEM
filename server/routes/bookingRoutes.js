// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/bookings", async (req, res) => {
  try {
    const booking = await bookingController.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all bookings with filters
router.get("/bookings", async (req, res) => {
  try {
    const filters = {
      customerName: req.query.customerName,
      bookingStatus: req.query.bookingStatus,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const bookings = await bookingController.getBookings(filters);
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get booking by ID
router.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await bookingController.getBookingById(req.params.id);
    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

// Cancel booking
router.post("/bookings/:id/cancel", async (req, res) => {
  try {
    const booking = await bookingController.cancelBooking(req.params.id);
    res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Complete booking (checkout)
router.post("/bookings/:id/complete", async (req, res) => {
  try {
    const booking = await bookingController.completeBooking(req.params.id);
    res.json({
      success: true,
      message: "Booking completed successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

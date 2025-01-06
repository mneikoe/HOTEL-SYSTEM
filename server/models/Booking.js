const mongoose = require("mongoose");
const shortid = require("shortid");

// Booking Schema Definition
const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: shortid.generate },
    roomId: { type: String, required: true, ref: "Room" },
    customerName: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "checked-in", "checked-out"],
      default: "available",
    },
    createdBy: {
      id: { type: String, required: true },
      role: { type: String, required: true }, // 'admin', 'manager', or 'receptionist'
    },
    price: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

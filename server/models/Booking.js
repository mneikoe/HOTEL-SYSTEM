const mongoose = require("mongoose");
const shortid = require("shortid");

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: shortid.generate },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    roomNumber: {
      type: String,
      ref: "Room",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: Number,
      required: true,
    },
    customerAdharId: {
      type: String,
      required: true,
    },
    customerAddress: { type: String, required: true },
    NumberOfPeople: { type: Number, required: true },
    checkInDateTime: {
      type: Date,
      required: true,
    },

    checkOutDateTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled", "completed/fc", "completed/ec"],
      default: "confirmed",
    },
    sellingPricePerDay: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
      required: true,
    },
    balanceAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "settled"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;

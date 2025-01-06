const mongoose = require("mongoose");

// Room Schema Definition
const roomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Economic", "Deluxe", "Super Deluxe", "Larger than Life"],
      required: true,
    },
    roomNumber: { type: String, required: true },
    floorNumber: { type: String, required: true },
    price: { type: Number, required: true },
    dateOfCreation: { type: Date, default: Date.now },
    createdBy: {
      id: { type: String, required: true },
      role: { type: String, required: true }, // 'admin', 'manager', or 'receptionist'
    },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

// Create a unique compound index for roomNumber and floorNumber.
roomSchema.index({ roomNumber: 0, floorNumber: 0 });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

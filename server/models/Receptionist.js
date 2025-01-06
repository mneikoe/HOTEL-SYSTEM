const mongoose = require("mongoose");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Receptionist Schema Definition
const receptionistSchema = new mongoose.Schema(
  {
    _id: { type: String, default: shortid.generate },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    dateOfJoining: { type: Date, required: true },
  },
  { timestamps: true }
);

// Method to compare passwords
receptionistSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
receptionistSchema.methods.generateAuthToken = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const Receptionist = mongoose.model("Receptionist", receptionistSchema);

module.exports = Receptionist;

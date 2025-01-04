const mongoose = require("mongoose");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Manager Schema Definition
const managerSchema = new mongoose.Schema(
  {
    _id: { type: String, default: shortid.generate },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Method to compare passwords
managerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
managerSchema.methods.generateAuthToken = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;

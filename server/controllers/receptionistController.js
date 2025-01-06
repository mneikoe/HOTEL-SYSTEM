const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Receptionist = require("../models/Receptionist");
require("dotenv").config();

// Register Receptionist
exports.registerReceptionist = async (req, res) => {
  const { name, email, dateOfJoining } = req.body;

  try {
    const newReceptionist = new Receptionist({
      name,
      email,

      dateOfJoining,
    });
    await newReceptionist.save();

    res.status(201).json({
      message: "Receptionist registered successfully",
      id: newReceptionist._id,
      createdAt: newReceptionist.createdAt,
      dateOfJoining: newReceptionist.dateOfJoining,
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering receptionist" });
  }
};

// Login Receptionist

exports.loginReceptionist = async (req, res) => {
  const { id, name } = req.body;
  try {
    const receptionist = await Receptionist.findById(id);
    if (!receptionist || receptionist.name !== name) {
      return res.status(401).json({ message: "Invalid ID or name" });
    }
    const token = receptionist.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, secure: false });
    return res.status(200).json({ token, user: receptionist });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Receptionists
exports.getReceptionists = async (req, res) => {
  try {
    const receptionists = await Receptionist.find();
    res.json(receptionists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching receptionists" });
  }
};

// Get Receptionist by ID
exports.getReceptionistById = async (req, res) => {
  try {
    const receptionist = await Receptionist.findById(req.params.id);
    if (!receptionist) {
      return res.status(404).json({ error: "Receptionist not found" });
    }
    res.json(receptionist);
  } catch (error) {
    res.status(500).json({ error: "Error fetching receptionist" });
  }
};

// Update Receptionist
exports.updateReceptionist = async (req, res) => {
  const { name, email, password, dateOfJoining } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedReceptionist = await Receptionist.findByIdAndUpdate(
      req.params.id,
      { name, email, password: hashedPassword, dateOfJoining },
      { new: true }
    );

    if (!updatedReceptionist) {
      return res.status(404).json({ error: "Receptionist not found" });
    }
    updatedReceptionist.updatedAt = new Date(); // Manually update the updatedAt timestamp
    res.json({
      message: "Receptionist updated successfully",
      updatedAt: updatedReceptionist.updatedAt,
      dateOfJoining: updatedReceptionist.dateOfJoining,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating receptionist" });
  }
};

// Delete Receptionist
exports.deleteReceptionist = async (req, res) => {
  try {
    const receptionist = await Receptionist.findByIdAndDelete(req.params.id);
    if (!receptionist) {
      return res.status(404).json({ error: "Receptionist not found" });
    }
    res.json({
      message: "Receptionist deleted successfully",
      deletedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting receptionist" });
  }
};

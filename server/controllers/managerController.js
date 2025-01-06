const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Manager = require("../models/Manager");
require("dotenv").config();

// Register Manager
exports.registerManager = async (req, res) => {
  const { name, email, dateOfJoining } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({
      name,
      email,

      dateOfJoining: new Date(dateOfJoining), // Ensure the date is correctly parsed
    });
    await newManager.save();
    res.status(201).json({
      message: "Manager registered successfully",
      id: newManager._id,
      createdAt: newManager.createdAt,
      dateOfJoining: newManager.dateOfJoining,
    });
  } catch (error) {
    console.error("Error registering manager:", error); // Log detailed error
    res.status(500).json({ error: "Error registering manager" });
  }
};
// Login Manager
exports.loginManager = async (req, res) => {
  const { id, name } = req.body;
  try {
    const manager = await Manager.findById(id);
    if (!manager || manager.name !== name) {
      return res.status(401).json({ message: "Invalid ID or name" });
    }
    const token = manager.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, secure: false });
    return res.status(200).json({ token, user: manager });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Get Managers
exports.getManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching managers" });
  }
};

// Get Manager by ID
exports.getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    res.json(manager);
  } catch (error) {
    console.error("Error fetching manager:", error);
    res.status(500).json({ error: "Error fetching manager" });
  }
};

// Update Manager
exports.updateManager = async (req, res) => {
  const { name, email, password, dateOfJoining } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedManager = await Manager.findByIdAndUpdate(
      req.params.id,
      { name, email, password: hashedPassword, dateOfJoining },
      { new: true }
    );
    if (!updatedManager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    updatedManager.updatedAt = new Date(); // Manually update the updatedAt timestamp
    res.json({
      message: "Manager updated successfully",
      updatedAt: updatedManager.updatedAt,
      dateOfJoining: updatedManager.dateOfJoining,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating manager" });
  }
};

// Delete Manager
exports.deleteManager = async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    res.json({ message: "Manager deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting manager" });
  }
};

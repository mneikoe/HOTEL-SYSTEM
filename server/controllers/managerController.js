const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Manager = require("../models/Manager");
require("dotenv").config();

// Register Manager
exports.registerManager = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({ name, email, password: hashedPassword });
    await newManager.save();

    const token = newManager.generateAuthToken();

    res.status(201).json({ newManager, token });
    res.status(201).json({
      message: "Manager registered successfully",
      id: newManager._id,
      createdAt: newManager.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Error registering manager" });
  }
};

// Login Manager
exports.loginManager = async (req, res) => {
  const { id, password } = req.body;
  try {
    const manager = await Manager.findById(id).select("+password");
    if (!manager) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }
    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }
    const token = manager.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, secure: false });
    res.status(200).json({ token, user: manager });
    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
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
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedManager = await Manager.findByIdAndUpdate(
      req.params.id,
      { name, email, password: hashedPassword },
      { new: true }
    );

    if (!updatedManager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    res.json({ message: "Manager updated successfully", updatedManager });
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

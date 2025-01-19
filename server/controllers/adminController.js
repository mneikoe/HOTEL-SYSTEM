const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// JWT Secret from Environment Variables
const jwtSecret = process.env.JWT_SECRET;

// Register Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await Admin.findOne({ email });
  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "Admin already registered" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering admin" });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ error: "Admin not found Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      sameSite: "None", // For cross-origin requests
      maxAge: 3600000, // 1 hour expiration
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Admin Logout
exports.logoutAdmin = (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: "Logout successful" });
};
// Protected Route for testing JWT
exports.protectedRoute = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    res.json({ message: `Hello ${decoded.email}, you are authorized!` });
  });
};

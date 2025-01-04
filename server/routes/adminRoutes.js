const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  protectedRoute,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/protected", protectedRoute);

module.exports = router;

const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  protectedRoute,
} = require("../controllers/adminController");
const { logoutAdmin } = require("../controllers/adminController");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/protected", protectedRoute);

module.exports = router;

const express = require("express");
const {
  registerManager,
  loginManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
} = require("../controllers/managerController");
const router = express.Router();

router.post("/register", registerManager);
router.post("/login", loginManager);
router.get("/", getManagers);
router.get("/:id", getManagerById);
router.put("/:id", updateManager);
router.delete("/:id", deleteManager);

module.exports = router;

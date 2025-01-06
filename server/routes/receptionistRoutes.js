const express = require("express");
const {
  registerReceptionist,
  loginReceptionist,
  getReceptionists,
  getReceptionistById,
  updateReceptionist,
  deleteReceptionist,
} = require("../controllers/receptionistController");
const router = express.Router();

router.post("/register", registerReceptionist);
router.post("/login", loginReceptionist);
router.get("/", getReceptionists);
router.get("/:id", getReceptionistById);
router.put("/:id", updateReceptionist);
router.delete("/:id", deleteReceptionist);

module.exports = router;

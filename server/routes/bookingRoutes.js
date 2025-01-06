const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController"); // ensure correct path

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;

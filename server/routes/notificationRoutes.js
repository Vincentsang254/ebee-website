/** @format */

// routes/notificationRoutes.js
const express = require("express");
const {
	getNotifications,
	markAsRead,
	getNots,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/get/:userId",  getNotifications);
router.get("/get", getNots);
router.put("/marked/:notificationId",  markAsRead);

module.exports = router;

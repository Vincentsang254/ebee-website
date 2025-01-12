/** @format */

// routes/notificationRoutes.js
const express = require("express");
const {
	getNotifications,
	markAsRead,
	getNots,
} = require("../controllers/notificationController");
const { verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/get/:userId",verifyToken,  getNotifications);
router.get("/get",verifyToken, getNots);
router.put("/marked/:notificationId",verifyToken,  markAsRead);

module.exports = router;

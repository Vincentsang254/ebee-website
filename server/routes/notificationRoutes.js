/** @format */

// routes/notificationRoutes
const express = require("express");
const {
  getNotifications,
  markAsRead,
  getNots,
} = require("../controllers/notificationController");
const { verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/get/:userId", getNotifications);
router.get("/get", getNots);
router.put("/marked/:notificationId", markAsRead);

module.exports = router;

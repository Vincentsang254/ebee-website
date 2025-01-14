/** @format */

// routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  markAsRead,
  getNots,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/get/:userId", verifyToken, getNotifications);
router.get("/get", verifyToken, getNots);
router.put("/marked/:notificationId", verifyToken, markAsRead);

export default router;

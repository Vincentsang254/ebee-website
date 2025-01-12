// Importing necessary modules
import express from "express";
import {
  createOrders,
  deleteOrders,
  updateOrders,
  getOrders,
  getOrder,
} from "../controllers/orderController.js";  // Use `.js` for the module extension
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Define routes
router.post("/create",verifyToken, createOrders);
router.delete("/delete/:orderId",verifyToken, deleteOrders);
router.put("/update/:orderId",verifyToken, updateOrders);
router.get("/get-orders",verifyToken, getOrders);
router.get("/get-order/:orderId",verifyToken, getOrder);

// Export router as default
export default router;

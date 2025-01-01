// Importing necessary modules
import express from "express";
import {
  createOrders,
  deleteOrders,
  updateOrders,
  getOrders,
  getOrder,
} from "../controllers/orderController.js";  // Use `.js` for the module extension

const router = express.Router();

// Define routes
router.post("/create", createOrders);
router.delete("/delete/:orderId", deleteOrders);
router.put("/update/:orderId", updateOrders);
router.get("/get-orders", getOrders);
router.get("/get-order/:orderId", getOrder);

// Export router as default
export default router;

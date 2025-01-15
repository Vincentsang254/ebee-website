// consting necessary modules
const express = require("express");
const {
  createOrders,
  deleteOrders,
  updateOrders,
  getOrders,
  getOrder,
} = require("../controllers/orderController");  // Use `.js` for the module extension
const { verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

// Define routes
router.post("/create",verifyToken, createOrders);
router.delete("/delete/:orderId",verifyToken, deleteOrders);
router.put("/update/:orderId",verifyToken, updateOrders);
router.get("/get-orders",verifyToken, getOrders);
router.get("/get-order/:orderId",verifyToken, getOrder);


module.exports = router;

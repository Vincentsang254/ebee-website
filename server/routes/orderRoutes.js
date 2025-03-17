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
router.post("/create", createOrders);
router.delete("/delete/:orderId",deleteOrders);
router.put("/update/:orderId",updateOrders);
router.get("/get", getOrders);
router.get("/get/:orderId",getOrder);


module.exports = router;

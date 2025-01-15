// Importing necessary modules
const express = require("express");
const {
  initiateSTKPush,
  processCallback,
} = require("../controllers/paymentController");  // Include the .js extension
const { verifyToken } = require("../middlewares/AuthMiddleware");
const generateDarajaToken = require("../middlewares/generaDarajateToken");

const router = express.Router();

// Define routes
router.post("/initiate-stk-push",verifyToken, generateDarajaToken, initiateSTKPush);
router.post("/process-callback", processCallback);


module.exports = router;

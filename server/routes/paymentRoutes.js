// Importing necessary modules
import express from "express";
import {
  initiateSTKPush,
  processCallback,
  generateDarajaToken,
} from "../controllers/paymentController.js";  // Include the .js extension

const router = express.Router();

// Define routes
router.post("/initiate-stk-push", generateDarajaToken, initiateSTKPush);
router.post("/process-callback", processCallback);



// Export router as default
export default router;

// Import necessary modules
import express from "express";
import {
  createAddress,
  updateUser,
  getUserAddress
} from "../controllers/userAddressController.js";  // Ensure to use the .js extension

const router = express.Router();

// Define routes
router.get("/get", getUserAddress);
router.post("/create", createAddress);
router.put("/update/:addressId", updateUser);

// Export the router as default
export default router;

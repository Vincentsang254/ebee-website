// Import necessary modules
import express from "express";
import {
  createAddress,
  updateUser,
  getUserAddress
} from "../controllers/userAddressController.js";  // Ensure to use the .js extension
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Define routes
router.get("/get",verifyToken, getUserAddress);
router.post("/create",verifyToken, createAddress);
router.put("/update/:addressId",verifyToken, updateUser);

// Export the router as default
export default router;

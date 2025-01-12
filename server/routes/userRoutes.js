// Import necessary modules
import express from "express";
import {
  deleteUser,
  getUsers,
  createUsers,
  updateUser,
  getUserById
} from "../controllers/userController.js";  // Make sure to use .js extension
import { verifyToken } from "../middlewares/AuthMiddleware.js";

// If you're using AuthMiddleware, import it here, even though it's not used in your current routes
// import { someMiddlewareFunction } from "../middlewares/AuthMiddleware.js";  // Example if needed

const router = express.Router();

// Define routes
router.delete("/delete/:userId",verifyToken, deleteUser);
router.get("/get-users",verifyToken, getUsers);
router.post("/create",verifyToken, createUsers);
router.put("/update/:userId",verifyToken, updateUser);
router.get("/get-user/:userId",verifyToken, getUserById);

// Export the router as default
export default router;

// Import necessary modules
import express from "express";
import {
  deleteUser,
  getUsers,
  createUsers,
  updateUser,
  getUserById
} from "../controllers/userController.js"; 
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Define routes
router.delete("/delete/:userId",verifyToken, deleteUser);
router.get("/get-users",verifyToken, getUsers);
router.post("/create",verifyToken, createUsers);
router.put("/update/:userId",verifyToken, updateUser);
router.get("/get-user/:userId",verifyToken, getUserById);

// Export the router as default
export default router;

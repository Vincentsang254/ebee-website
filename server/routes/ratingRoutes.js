// Import necessary modules
import express from "express";
import {
  deleteRatings,
  updateRatings,
  getRatings,
  getRatingById,
  createRatings
} from "../controllers/ratingsController.js";  // Ensure to use the .js extension
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Define routes
router.post("/create",verifyToken, createRatings);
router.get("/get",verifyToken, getRatings);
router.delete("/delete/:ratingId",verifyToken, deleteRatings);
router.put("/update/:ratingId",verifyToken, updateRatings);
router.get("/get-rating/:ratingId",verifyToken, getRatingById);

// Export the router as default
export default router;

// Import necessary modules
import express from "express";
import {
  deleteRatings,
  updateRatings,
  getRatings,
  getRatingById,
  createRatings
} from "../controllers/ratingsController.js";  // Ensure to use the .js extension

const router = express.Router();

// Define routes
router.post("/create", createRatings);
router.get("/get", getRatings);
router.delete("/delete/:ratingId", deleteRatings);
router.put("/update/:ratingId", updateRatings);
router.get("/get-rating/:ratingId", getRatingById);

// Export the router as default
export default router;

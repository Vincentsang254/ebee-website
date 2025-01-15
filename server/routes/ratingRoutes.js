// const necessary modules
const express= require("express");
const {
  deleteRatings,
  updateRatings,
  getRatings,
  getRatingById,
  createRatings
}= require("../controllers/ratingsController");  // Ensure to use the .js extension
const { verifyToken }= require("../middlewares/AuthMiddleware");

const router = express.Router();

// Define routes
router.post("/create",verifyToken, createRatings);
router.get("/get",verifyToken, getRatings);
router.delete("/delete/:ratingId",verifyToken, deleteRatings);
router.put("/update/:ratingId",verifyToken, updateRatings);
router.get("/get-rating/:ratingId",verifyToken, getRatingById);


module.exports = router;

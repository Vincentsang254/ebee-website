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
router.post("/create",createRatings);
router.get("/get",getRatings);
router.delete("/delete/:ratingId",deleteRatings);
router.put("/update/:ratingId",updateRatings);
router.get("/get-rating/:ratingId",getRatingById);


module.exports = router;

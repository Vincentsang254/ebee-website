// const necessary modules
const express = require("express");
const {
  createProducts,
  deleteProducts,
  updateProducts,
  getProducts,
  getProductById,
  searchProducts
} = require("../controllers/productController");

const { verifyRoles, verifyToken } = require("../middlewares/AuthMiddleware");
const { upload } = require("../utils/cloudinary");


const router = express.Router();

// Define routes
router.post("/create", verifyToken, verifyRoles("Admin"), upload.single("image"), createProducts);
router.delete("/delete/:productId", verifyToken, verifyRoles("Admin"), deleteProducts);
router.put("/update/:productId", verifyToken, verifyRoles("Admin"), upload.single("image"), updateProducts);
router.get("/get", getProducts);
router.get("/get-product/:productId", verifyToken, getProductById);
router.post("/search", verifyToken, searchProducts);


module.exports = router;

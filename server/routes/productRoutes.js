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

const { upload } = require("../utils/cloudinary");


const router = express.Router();

// Define routes
router.post("/create", upload.single("image"), createProducts);
router.delete("/delete/:productId", deleteProducts);
router.put("/update/:productId", upload.single("image"), updateProducts);
router.get("/get", getProducts);
router.get("/get-product/:productId", getProductById);
router.post("/search", searchProducts);


module.exports = router;

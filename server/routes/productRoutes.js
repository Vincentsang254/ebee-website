// const necessary modules
const express = require("express");
const {
  createProducts,
  deleteProducts,
  updateProducts,
  getProducts,
  getProductById,
  searchProducts,

} = require("../controllers/productController");

const { upload } = require("../utils/cloudinary");


const router = express.Router();

// /api/products/get?page=1&limit=10
router.post("/create", upload.single("my_file"), createProducts);
router.delete("/delete/:productId", deleteProducts);
router.put("/update/:productId", upload.single("my_file"), updateProducts);
router.get("/get", getProducts);
router.get("/get/:productId", getProductById);
router.post("/search", searchProducts);


module.exports = router;

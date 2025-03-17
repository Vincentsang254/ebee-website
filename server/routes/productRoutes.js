// const necessary modules
const express = require("express");
const {
  createProducts,
  deleteProducts,
  updateProducts,
  getProducts,
  getProductById,
  searchProducts,
  handleImageUpload
} = require("../controllers/productController");

const { upload } = require("../utils/cloudinary");


const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/create", upload.single("my_file"), createProducts);
router.delete("/delete/:productId", deleteProducts);
router.put("/update/:productId", upload.single("image"), updateProducts);
router.get("/get", getProducts);
router.get("/get-product/:productId", getProductById);
router.post("/search", searchProducts);


module.exports = router;

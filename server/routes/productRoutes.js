// const necessary modules
const express = requires("express");
const {
  createProducts,
  deleteProducts,
  updateProducts,
  getProducts,
  getProductById,
  searchProducts
} = requires("../controllers/productController");

const { verifyRoles, verifyToken } = requires("../middlewares/AuthMiddleware");
const { upload } = requires("../utils/cloudinary");


const router = express.Router();

// Define routes
router.post("/create", verifyToken, verifyRoles("Admin"), upload.single("image"), createProducts);
router.delete("/delete/:productId", verifyToken, verifyRoles("Admin"), deleteProducts);
router.put("/update/:productId", verifyToken, verifyRoles("Admin"), upload.single("image"), updateProducts);
router.get("/get", getProducts);
router.get("/get-product/:productId", verifyToken, getProductById);
router.post("/search", verifyToken, searchProducts);


module.exports = router;

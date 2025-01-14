// Import necessary modules
import express from "express";
import {
  createProducts,
  deleteProducts,
  updateProducts,
  getProducts,
  getProductById,
  searchProductsByName
} from "../controllers/productController.js";

import { verifyRoles, verifyToken } from "../middlewares/AuthMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// Define routes
router.post("/create", verifyToken, verifyRoles("Admin"), upload.single("image"), createProducts);
router.delete("/delete/:productId", verifyToken, verifyRoles("Admin"), deleteProducts);
router.put("/update/:productId", verifyToken, verifyRoles("Admin"), upload.single("image"), updateProducts);
router.get("/get", verifyToken, getProducts);
router.get("/get-product/:productId", verifyToken, getProductById);
router.post("/search", verifyToken, searchProductsByName);

// Export router as default
export default router;

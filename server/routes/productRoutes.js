// Import necessary modules
import express from "express";
import {
  createProducts,
  deleteProducts,
  updateProducts,
  getProducts,
  getProductById,
  searchProductsByName
} from "../controllers/productController.js";  // Ensure to use the .js extension

import { verifyRoles } from "../middlewares/AuthMiddleware.js"; // Ensure to use the .js extension
import { upload } from "../utils/cloudinary.js";  // Ensure to use the .js extension

const router = express.Router();

// Define routes
router.post("/create", verifyRoles("Admin"), upload.single("image"), createProducts);
router.delete("/delete/:productId", verifyRoles("Admin"), deleteProducts);
router.put("/update/:productId", verifyRoles("Admin"), upload.array("images"), updateProducts);
router.get("/get", getProducts);
router.get("/get-product/:productId", getProductById);
router.post("/search", searchProductsByName);

// Export router as default
export default router;

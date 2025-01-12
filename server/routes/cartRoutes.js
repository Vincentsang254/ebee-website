/** @format */

import express from "express";
import {
	getCartCount,
	addProductToCart,
	removeItemFromCart,
	getCart,
	decreaseProductQuantity,
	increaseProductQuantity,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";


const router = express.Router();

router.get("/get-cart-count/:userId", verifyToken, getCartCount);
router.get("/get", verifyToken, getCart);
router.post("/add-product-to-cart",verifyToken, addProductToCart);
router.delete("/delete/:cartId",verifyToken, removeItemFromCart);
router.put("/delete/:cartId/descrease",verifyToken, decreaseProductQuantity);
router.put("/delete/:cartId/increase",verifyToken, increaseProductQuantity);

export default router;

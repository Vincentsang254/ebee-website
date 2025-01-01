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


const router = express.Router();

router.get("/get-cart-count/:userId", getCartCount);
router.get("/get", getCart);
router.post("/add-product-to-cart", addProductToCart);
router.delete("/delete/:cartId", removeItemFromCart);
router.put("/delete/:cartId/descrease", decreaseProductQuantity);
router.put("/delete/:cartId/increase", increaseProductQuantity);

export default router;

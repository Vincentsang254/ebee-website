/** @format */

const express = require("express");
const {
	getCartCount,
	addProductToCart,
	removeItemFromCart,
	getCart,
	decreaseProductQuantity,
	increaseProductQuantity,
} = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/AuthMiddleware");


const router = express.Router();

router.get("/get-cart-count/:userId", verifyToken, getCartCount);
router.get("/get", verifyToken, getCart);
router.post("/add-product-to-cart",verifyToken, addProductToCart);
router.delete("/delete/:cartId",verifyToken, removeItemFromCart);
router.put("/delete/:cartId/descrease",verifyToken, decreaseProductQuantity);
router.put("/delete/:cartId/increase",verifyToken, increaseProductQuantity);

module.exports = router;

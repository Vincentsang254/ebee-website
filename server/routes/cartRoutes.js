/** @format */

const express = require("express");
const {
	clearCart,
	addProductToCart,
	removeItemFromCart,
	getCart,
	decreaseProductQuantity,
	increaseProductQuantity,
} = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/AuthMiddleware");


const router = express.Router();

router.get("/clear", clearCart);//done
router.get("/get", getCart);//done
router.post("/add-product-to-cart",addProductToCart);//done
router.delete("/delete/:cartId",removeItemFromCart);//done
router.put("/delete/:cartId/descrease",decreaseProductQuantity);//done
router.put("/delete/:cartId/increase",increaseProductQuantity);//done

module.exports = router;

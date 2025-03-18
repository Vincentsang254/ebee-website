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

router.get("/clear/:userId", clearCart);//done
router.get("/get/:userId", getCart);//done
router.post("/add-product-to-cart",addProductToCart);//done
router.delete("/delete/:cartId",removeItemFromCart);//done
router.put("/update/:cartId/descrease",decreaseProductQuantity);//done
router.put("/update/:cartId/increase",increaseProductQuantity);//done

module.exports = router;

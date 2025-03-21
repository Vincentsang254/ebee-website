const { Carts, Products } = require("../models");

const addProductToCart = async (req, res) => {
  const { productId, userId } = req.body; // Ensure userId is provided

  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    let cart = await Carts.findOne({ where: { userId, productId } });

    if (cart) {
      // Atomically increment quantity and update total price in one go
      await cart.increment({
        quantity: 1,
        totalPrice: parseFloat(product.price),
      });
    } else {
      // Create a new cart entry
      cart = await Carts.create({
        userId,
        productId,
        quantity: 1,
        totalPrice: parseFloat(product.price),
      });
    }

    res.status(200).json({ status: true, data: cart });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const removeItemFromCart = async (req, res) => {
  try {
    const { userId, cartId } = req.params; // ✅ Get userId from request params

    // Find the cart item
    const cart = await Carts.findOne({ where: { id: cartId, userId } });

    if (!cart) {
      return res.status(404).json({ status: false, message: "Cart item not found or unauthorized" });
    }

    await cart.destroy();

    res.json({
      status: true,
      message: `Cart item with id ${cartId} removed successfully`,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const decreaseProductQuantity = async (req, res) => {
  try {
    const cartId = req.params.cartId; // Assuming cartId is passed as a route parameter

    const cart = await Carts.findByPk(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    if (cart.quantity > 1) {
      cart.quantity -= 1;
      const product = await Products.findByPk(cart.productId);
      cart.totalPrice = cart.quantity * parseFloat(product.price);
      await cart.save();
      res.json({
        status: true,
        message: "Product quantity decreased in cart",
        cart,
      });
    } else {
      await cart.destroy();
      res.json({ status: true, message: "Product removed from cart" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const increaseProductQuantity = async (req, res) => {
  try {
    const cartId = req.params.cartId; // Assuming cartId is passed as a route parameter

    const cart = await Carts.findByPk(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    cart.quantity += 1;
    const product = await Products.findByPk(cart.productId);
    cart.totalPrice = cart.quantity * parseFloat(product.price);
    await cart.save();

    res.json({
      status: true,
      message: "Product quantity increased in cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ Extract userId from URL

    if (!userId) {
      return res.status(400).json({ status: false, message: "User ID is required" });
    }

    const cartItems = await Carts.findAll({
      where: { userId },
      include: [
        {
          model: Products,
          as: "product",
          attributes: ["id", "name", "desc", "price", "imageUrl"], // Ensure correct fields
        },
      ],
    });
    

    if (!cartItems.length) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }

    res.json({ status: true, data: cartItems });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Carts.destroy({ where: { userId } });
    res.json({ status: true, message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = {
  clearCart,
  getCart,
  increaseProductQuantity,
  decreaseProductQuantity,
  addProductToCart,
  removeItemFromCart,
 
};

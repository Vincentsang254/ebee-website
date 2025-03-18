const { Carts, Products } = require("../models");

const addProductToCart = async (req, res) => {
  const { productId, userId } = req.body; // Fix: Extract userId properly

  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    let cart = await Carts.findOne({
      where: { userId, productId }, // Fix: Correct query using userId
    });

    if (cart) {
      await cart.increment("quantity"); // Safer way to update quantity
      cart.totalPrice = cart.quantity * parseFloat(product.price);
      await cart.save();
    } else {
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
    const cartId = req.params.cartId; // Assuming cartId is passed as a route parameter

    const cart = await Carts.findByPk(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    await cart.destroy();

    res.json({
      status: true,
      message: `Cart id ${cartId} removed successfully`,
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
    const {userId} = req.body
    const cartItems = await Carts.findAll({
      where: { userId },
      include: [
        {
          model: Products,
          as: "product",
        },
      ],
    });

    if (!cartItems.length) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }

    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.quantity * parseFloat(item.product.price);
    }, 0);

    const response = {
      total: cartItems.length,
      totalPrice,
      cartItems: cartItems.map((item) => ({
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.quantity * parseFloat(item.product.price),
        product: item.product,
      })),
    };

    res.json({
      status: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



const clearCart = async (req, res) => {
  try {
    const {userId} = req.body
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

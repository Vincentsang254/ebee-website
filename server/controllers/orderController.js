/** @format */

const sendNotificationEmail = require("../brevo/email.brevo");
const { Notifications, Orders } = require("../models");

const createOrders = async (req, res) => {
  const { totalPrice, orderItems, paymentMethod, userAddressId } = req.body;
  const userId = req.user.id; // Assuming req.user contains an object with an id property

  // Validate required fields
  if (
    !totalPrice ||
    !orderItems ||
    !Array.isArray(orderItems) ||
    orderItems.length === 0 ||
    !paymentMethod ||
    !userId ||
    !userAddressId
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Missing or invalid required fields" });
  }

  try {
    // Create the order
    const order = await Orders.create({
      totalPrice,
      orderItems,
      paymentMethod,
      userId,
      userAddressId,
    });

    // Create a notification for the user
    const notificationContent = `New order placed (#${order.id})`;
    await Notifications.create({
      userId,
      content: notificationContent,
      type: "order",
    });

    // Send email notification
    const userName = req.user.name; // Assuming req.user contains an object with a name property
    const userEmail = req.user.email; // Assuming req.user contains an object with an email property
    await sendNotificationEmail(
      userEmail,
      userName,
      "Order Confirmation",
      notificationContent
    );

    res.status(200).json({ status: true, data: order });
  } catch (error) {
    console.error(`Order creation failed: ${error}`);
    res
      .status(500)
      .json({
        status: false,
        message: "Order creation failed, please try again later.",
      });
  }
};

const deleteOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const deletedOrder = await Orders.findOne({ where: { id: orderId } });

    if (!deletedOrder) {
      return res.status(404).json({
        status: false,
        message: `Order with ID ${orderId} not found`,
      });
    }

    await Orders.destroy({ where: { id: orderId } });

    // Create a notification for the user
    const notificationContent = `Order deleted (#${orderId})`;
    await createNotification(
      deletedOrder.userId,
      "order_deleted",
      notificationContent
    );

    res
      .status(201)
      .json({ status: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateOrders = async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id; // Make sure req.user contains the authenticated user's info

  if (!userId) {
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized, please login" });
  }

  try {
    const [updated] = await Orders.update(req.body, {
      where: { id: orderId },
    });

    if (updated) {
      // Create a notification for the user
      const notificationContent = `Order updated (#${orderId})`;
      const updatedOrder = await createNotification(
        userId,
        "order_updated",
        notificationContent
      );

      res.status(200).json({
        status: true,
        message: "Order updated successfully",
        data: updatedOrder,
      });
    } else {
      res
        .status(404)
        .json({ status: false, message: `Order with ID ${orderId} not found` });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.status(200).json({ status: true, data: orders });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Orders.findByPk(orderId);
    if (order) {
      res.status(200).json({ status: true, data: order });
    } else {
      res
        .status(404)
        .json({ status: false, error: `Order with ID ${orderId} not found` });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createOrders,
  updateOrders,
  getOrders,
  getOrder,
  deleteOrders,
};

/** @format */

const { Notifications } = require("../models");
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notifications.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]], // Sort by latest first
    });

    res.status(200).json({ status: true, data: notifications });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notifications.findByPk(notificationId);

    if (!notification) {
      return res
        .status(404)
        .json({ status: false, message: "Notification not found" });
    }

    notification.is_read = true;
    await notification.save();

    res
      .status(200)
      .json({ status: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getNots = async (req, res) => {
  try {
    const notifications = await Notifications.findAll();
    res.status(200).json({ status: false, data: notifications });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.expors = {
  getNotifications,
  markAsRead,
  getNots,
};

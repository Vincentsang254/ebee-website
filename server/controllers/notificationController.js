/** @format */

import Notifications from "../models/Notification.js";
export const getNotifications = async (req, res) => {
	try {
		const userId = req.user.id; 

		const notifications = await Notifications.findAll({
			where: { userId },
			order: [["createdAt", "DESC"]], // Sort by latest first
		});

		res.status(200).json({ status: 200, data: notifications });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

export const markAsRead = async (req, res) => {
	try {
		const notificationId = req.params.id;
		const notification = await Notifications.findByPk(notificationId);

		if (!notification) {
			return res.status(404).json({ message: "Notification not found" });
		}

		notification.is_read = true;
		await notification.save();

		res.status(200).json({ message: "Notification marked as read" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getNots = async (req, res) => {
	try {
		const notifications = await Notifications.findAll();
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


// Import necessary models using ES6 import syntax

import Notifications from "../models/Notification.js";

// Function to create a notification
const createNotification = async (userId, type, content) => {
  try {
    const notification = await Notifications.create({
      userId,
      type,
      content,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Export the createNotification function
export { createNotification };

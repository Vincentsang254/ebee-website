// Import necessary models using ES6 import syntax
import { Notifications } from "../models.js";  // Ensure to use the .js extension

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

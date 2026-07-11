const mongoose = require("mongoose");
const Notification = require("../models/notification");

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const getNotifications = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: { notifications, count: notifications.length }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications"
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const notificationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid notification id"
      });
    }

    const notification = await Notification.findOne({ _id: notificationId, user: userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: { notification }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notification"
    });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: { notifications, count: notifications.length }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notifications"
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const notificationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid notification id"
      });
    }

    const notification = await Notification.findOne({ _id: notificationId, user: userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete notification"
    });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};

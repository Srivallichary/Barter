const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.put("/read-all", auth, markAllNotificationsAsRead);
router.put("/:id/read", auth, markNotificationAsRead);
router.delete("/:id", auth, deleteNotification);

module.exports = router;

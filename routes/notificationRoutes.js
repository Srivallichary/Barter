const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

// Get notifications
router.get("/", auth, getNotifications);

// Mark notification as read
router.put("/:id/read", auth, markAsRead);

module.exports = router;

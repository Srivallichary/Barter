const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  sendMessage,
  getConversation,
  getUserConversations
} = require("../controllers/messageController");

router.post("/", auth, sendMessage);
router.get("/conversations", auth, getUserConversations);
router.get("/:tradeId/:userId", auth, getConversation);

module.exports = router;

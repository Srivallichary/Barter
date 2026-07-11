const mongoose = require("mongoose");
const Message = require("../models/message");
const Trade = require("../models/trade");

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const sendMessage = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const { tradeId, receiverId, text } = req.body;

    if (!tradeId || !receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: "tradeId, receiverId and text are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tradeId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid trade or receiver id"
      });
    }

    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found"
      });
    }

    const participants = [String(trade.fromUser), String(trade.toUser)];

    if (!participants.includes(String(userId)) || !participants.includes(String(receiverId))) {
      return res.status(403).json({
        success: false,
        message: "You can only message participants in this trade"
      });
    }

    if (String(userId) === String(receiverId)) {
      return res.status(409).json({
        success: false,
        message: "Sender and receiver cannot be the same"
      });
    }

    const message = await Message.create({
      trade: tradeId,
      sender: userId,
      receiver: receiverId,
      text
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { message }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send message"
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const { tradeId, userId: otherUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tradeId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid trade or user id"
      });
    }

    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found"
      });
    }

    const participants = [String(trade.fromUser), String(trade.toUser)];

    if (!participants.includes(String(userId)) || !participants.includes(String(otherUserId))) {
      return res.status(403).json({
        success: false,
        message: "You can only view messages for participants in this trade"
      });
    }

    const messages = await Message.find({
      trade: tradeId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Conversation retrieved successfully",
      data: { messages, count: messages.length }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch conversation"
    });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const conversations = messages.reduce((acc, message) => {
      const partnerId = String(message.sender) === String(userId) ? message.receiver : message.sender;
      const existing = acc.find((entry) => String(entry.userId) === String(partnerId));

      if (!existing) {
        acc.push({ userId: partnerId, tradeId: message.trade, lastMessage: message });
      }

      return acc;
    }, []);

    return res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      data: { conversations, count: conversations.length }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch conversations"
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getUserConversations
};

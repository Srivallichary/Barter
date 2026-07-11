const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    createTrade,
    getUserTrades,
    acceptTrade,
    rejectTrade,
    completeTrade,
    addTradeMessage
} = require("../controllers/tradeController");

// Create Trade Request
router.post("/", auth, createTrade);

// Get Trades for Authenticated User
router.get("/", auth, getUserTrades);

// Get Trades for a Specific User
router.get("/user/:userId", auth, getUserTrades);

// Accept Trade
router.put("/:id/accept", auth, acceptTrade);

// Reject Trade
router.put("/:id/reject", auth, rejectTrade);

// Complete Trade
router.put("/:id/complete", auth, completeTrade);

// Add Message to Trade Chat
router.post("/:id/message", auth, addTradeMessage);

module.exports = router;
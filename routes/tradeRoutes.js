const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
    createTrade,
    getUserTrades,
    acceptTrade,
    rejectTrade,
    completeTrade,
    addTradeMessage,
    reviewTrade
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

// Review a completed trade
router.post("/:id/review", auth, reviewTrade);

module.exports = router;
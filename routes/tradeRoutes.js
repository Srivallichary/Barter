const express = require("express");

const router = express.Router();

const {
    createTrade,
    getUserTrades,
    acceptTrade,
    rejectTrade,
    completeTrade
} = require("../controllers/tradeController");

// Create Trade Request
router.post("/", createTrade);

// Get Trades for a User
router.get("/user/:userId", getUserTrades);

// Accept Trade
router.put("/:id/accept", acceptTrade);

// Reject Trade
router.put("/:id/reject", rejectTrade);

// Complete Trade
router.put("/:id/complete", completeTrade);

module.exports = router;
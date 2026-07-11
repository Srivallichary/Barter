const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

const {
    createTrade,
    getUserTrades,
    acceptTrade,
    rejectTrade,
    completeTrade
} = require("../controllers/tradeController");

// Create Trade Request
router.post("/", auth, createTrade);

// Get Trades for a User
router.get("/user/:userId", auth, getUserTrades);

// Accept Trade
router.put("/:id/accept", auth, acceptTrade);

// Reject Trade
router.put("/:id/reject", auth, rejectTrade);

// Complete Trade
router.put("/:id/complete", auth, completeTrade);

module.exports = router;
const Trade = require("../models/trade");
const Item = require("../models/item");

/**
 * @desc    Create a trade request
 * @route   POST /api/trades
 * @access  Private
 */
const createTrade = async (req, res) => {
    try {
        const {
            fromUser,
            toUser,
            offeredItem,
            requestedItem
        } = req.body;

        // Check required fields
        if (!fromUser || !toUser || !offeredItem || !requestedItem) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Check if both items exist
        const offered = await Item.findById(offeredItem);
        const requested = await Item.findById(requestedItem);

        if (!offered || !requested) {
            return res.status(404).json({
                success: false,
                message: "One or both items not found"
            });
        }

        // Check if items are available
        if (
            offered.status !== "available" ||
            requested.status !== "available"
        ) {
            return res.status(400).json({
                success: false,
                message: "One or both items are not available for trade"
            });
        }

        // Create trade request
        const trade = await Trade.create({
            fromUser,
            toUser,
            offeredItem,
            requestedItem
        });

        res.status(201).json({
            success: true,
            message: "Trade request created successfully",
            trade
        });

        if (offeredItem === requestedItem) {
    return res.status(400).json({
        success: false,
        message: "You cannot trade an item with itself"
    });
}

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * @desc    Get all trades for a user
 * @route   GET /api/trades/user/:userId
 * @access  Private
 */
const getUserTrades = async (req, res) => {
    try {
        const trades = await Trade.find({
            $or: [
                { fromUser: req.params.userId },
                { toUser: req.params.userId }
            ]
        })
        .populate("fromUser", "name email")
        .populate("toUser", "name email")
        .populate("offeredItem", "title category status")
        .populate("requestedItem", "title category status");

        res.status(200).json({
            success: true,
            count: trades.length,
            trades
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Accept a trade request
 * @route   PUT /api/trades/:id/accept
 * @access  Private
 */
const acceptTrade = async (req, res) => {
    try {
        // Find trade
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        // Check if trade is still pending
        if (trade.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Trade has already been processed"
            });
        }

        // Update trade status
        trade.status = "accepted";

        await trade.save();

        res.status(200).json({
            success: true,
            message: "Trade accepted successfully",
            trade
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Reject a trade request
 * @route   PUT /api/trades/:id/reject
 * @access  Private
 */
const rejectTrade = async (req, res) => {
    try {
        // Find trade
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        // Check if trade is still pending
        if (trade.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Trade has already been processed"
            });
        }

        // Update trade status
        trade.status = "rejected";

        await trade.save();

        res.status(200).json({
            success: true,
            message: "Trade rejected successfully",
            trade
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Complete a trade
 * @route   PUT /api/trades/:id/complete
 * @access  Private
 */
const completeTrade = async (req, res) => {
    try {
        // Find trade
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        // Trade must be accepted before completion
        if (trade.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Only accepted trades can be completed"
            });
        }

        // Update trade status
        trade.status = "completed";
        await trade.save();

        // Update both items
        await Item.findByIdAndUpdate(trade.offeredItem, {
            status: "traded"
        });

        await Item.findByIdAndUpdate(trade.requestedItem, {
            status: "traded"
        });

        res.status(200).json({
            success: true,
            message: "Trade completed successfully",
            trade
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTrade,
    getUserTrades,
    acceptTrade,
    rejectTrade,
    completeTrade
};
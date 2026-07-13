const mongoose = require("mongoose");
const Trade = require("../models/trade");
const Item = require("../models/item");
const User = require("../models/user");
const Review = require("../models/review");

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const syncUserRating = async (userId) => {
    if (!userId) return;

    const user = await User.findById(userId);
    if (!user) return;

    const reviews = await Review.find({ reviewee: userId });
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? Number((reviews.reduce((sum, review) => sum + review.score, 0) / reviewCount).toFixed(1))
        : Number(user.rating || 0);

    await User.findByIdAndUpdate(userId, {
        $set: {
            rating: averageRating,
            reviewCount,
        }
    });
};

/**
 * @desc    Create a trade request
 * @route   POST /api/trades
 * @access  Private
 */
const createTrade = async (req, res) => {
    try {
        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { toUser, offeredItem, requestedItem } = req.body;

        if (!toUser || !offeredItem || !requestedItem) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        if (String(offeredItem) === String(requestedItem)) {
            return res.status(409).json({
                success: false,
                message: "You cannot trade an item with itself"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(offeredItem) || !mongoose.Types.ObjectId.isValid(requestedItem) || !mongoose.Types.ObjectId.isValid(toUser)) {
            return res.status(422).json({
                success: false,
                message: "Invalid item or user id"
            });
        }

        const offered = await Item.findById(offeredItem);
        const requested = await Item.findById(requestedItem);

        if (!offered || !requested) {
            return res.status(404).json({
                success: false,
                message: "One or both items not found"
            });
        }

        if (String(offered.owner) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "You can only trade items you own"
            });
        }

        if (offered.status !== "available" || requested.status !== "available") {
            return res.status(400).json({
                success: false,
                message: "One or both items are not available for trade"
            });
        }

        const trade = await Trade.create({
            fromUser: requesterId,
            toUser,
            offeredItem,
            requestedItem,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Trade request created successfully",
            data: { trade }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create trade"
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
        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const userId = req.params.userId || requesterId;

        const trades = await Trade.find({
            $or: [
                { fromUser: userId },
                { toUser: userId }
            ]
        })
            .populate("fromUser", "name email avatar")
            .populate("toUser", "name email avatar")
            .populate("offeredItem", "title category status images image owner")
            .populate("requestedItem", "title category status images image owner");

        return res.status(200).json({
            success: true,
            message: "Trades retrieved successfully",
            data: {
                trades,
                count: trades.length
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trades"
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
        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { meetupLocation, meetupTime } = req.body;
        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        if (String(trade.toUser) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "Only the recipient can accept this trade"
            });
        }

        if (trade.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Trade has already been processed"
            });
        }

        trade.status = "accepted";
        if (meetupLocation) trade.meetupLocation = meetupLocation;
        if (meetupTime) trade.meetupTime = meetupTime;

        await trade.save();

        return res.status(200).json({
            success: true,
            message: "Trade accepted successfully",
            data: { trade }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to accept trade"
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
        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        if (String(trade.toUser) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "Only the recipient can reject this trade"
            });
        }

        if (trade.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Trade has already been processed"
            });
        }

        trade.status = "rejected";
        await trade.save();

        return res.status(200).json({
            success: true,
            message: "Trade rejected successfully",
            data: { trade }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reject trade"
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
        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const trade = await Trade.findById(req.params.id);

        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        if (String(trade.toUser) !== String(requesterId) && String(trade.fromUser) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to complete this trade"
            });
        }

        if (trade.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Only accepted trades can be completed"
            });
        }

        trade.status = "completed";
        await trade.save();

        await Item.findByIdAndUpdate(trade.offeredItem, { status: "traded" });
        await Item.findByIdAndUpdate(trade.requestedItem, { status: "traded" });

        await User.findByIdAndUpdate(trade.fromUser, { $inc: { completedTrades: 1 } });
        await User.findByIdAndUpdate(trade.toUser, { $inc: { completedTrades: 1 } });
        await syncUserRating(trade.fromUser);
        await syncUserRating(trade.toUser);

        return res.status(200).json({
            success: true,
            message: "Trade completed successfully",
            data: { trade }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to complete trade"
        });
    }
};

/**
 * @desc    Add a message to a trade request
 * @route   POST /api/trades/:id/message
 * @access  Private
 */
const addTradeMessage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Message text is required"
            });
        }

        const senderId = getRequesterId(req);
        const trade = await Trade.findById(req.params.id);
        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade request not found"
            });
        }

        if (String(trade.fromUser) !== String(senderId) && String(trade.toUser) !== String(senderId)) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this trade"
            });
        }

        const senderUser = await User.findById(senderId);
        const senderName = senderUser ? senderUser.name : "Member";
        const messagePayload = {
            sender: senderId,
            senderName,
            text,
            createdAt: new Date()
        };

        trade.messages.push(messagePayload);
        await trade.save();

        const io = req.app.get("io");
        if (io) {
            io.to(`trade:${trade._id}`).emit("trade-message", {
                tradeId: trade._id.toString(),
                message: messagePayload
            });
        }

        return res.status(200).json({
            success: true,
            data: { messages: trade.messages }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const reviewTrade = async (req, res) => {
    try {
        const requesterId = getRequesterId(req);
        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const trade = await Trade.findById(req.params.id);
        if (!trade) {
            return res.status(404).json({
                success: false,
                message: "Trade not found"
            });
        }

        if (String(trade.fromUser) !== String(requesterId) && String(trade.toUser) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this trade"
            });
        }

        if (trade.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Only completed trades can be reviewed"
            });
        }

        const { score, comment = "" } = req.body;
        if (!Number.isInteger(score) || score < 1 || score > 5) {
            return res.status(400).json({
                success: false,
                message: "Please provide a rating between 1 and 5"
            });
        }

        const existingReview = await Review.findOne({ trade: trade._id, reviewer: requesterId });
        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this trade"
            });
        }

        const revieweeId = String(trade.fromUser) === String(requesterId) ? trade.toUser : trade.fromUser;
        const review = await Review.create({
            trade: trade._id,
            reviewer: requesterId,
            reviewee: revieweeId,
            score,
            comment
        });

        await syncUserRating(revieweeId);

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: { review }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to submit review"
        });
    }
};

module.exports = {
    createTrade,
    getUserTrades,
    acceptTrade,
    rejectTrade,
    completeTrade,
    addTradeMessage,
    reviewTrade
};
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const User = require("../models/user");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id || getRequesterId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const requesterId = getRequesterId(req);
        const isOwner = String(userId) === String(requesterId);
        const user = await User.findById(userId).select(isOwner ? "-password" : "-password -email -phone -idCardImage -verificationSubmittedAt -verificationReviewedAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const safeUser = user.toObject();
        if (!isOwner) {
            delete safeUser.email;
            delete safeUser.phone;
            delete safeUser.idCardImage;
            delete safeUser.verificationSubmittedAt;
            delete safeUser.verificationReviewedAt;
        }

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: { user: safeUser }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch profile"
        });
    }
};

const getRatings = async (req, res) => {
    try {
        const userId = req.params.id || getRequesterId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ratings retrieved successfully",
            data: {
                rating: user.rating || 0,
                completedTrades: user.completedTrades || 0,
                reviewCount: user.reviewCount || 0
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch ratings"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = getRequesterId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const { name, avatar, phone, department, bio } = req.body;
        const updatedFields = {};

        if (name !== undefined) updatedFields.name = name;
        if (avatar !== undefined) updatedFields.avatar = avatar;
        if (phone !== undefined) updatedFields.phone = phone;
        if (department !== undefined) updatedFields.department = department;
        if (bio !== undefined) updatedFields.bio = bio;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update profile"
        });
    }
};

const uploadIdCard = async (req, res) => {
    try {
        const userId = getRequesterId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "ID card image is required" });
        }

        let imageUrl = `/uploads/${path.basename(req.file.path)}`;
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "barter/id-cards",
                resource_type: "image"
            });
            imageUrl = uploadResult.secure_url;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    idCardImage: imageUrl,
                    verificationStatus: "pending",
                    verificationSubmittedAt: new Date(),
                }
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(200).json({ success: true, message: "ID card uploaded successfully", data: { user } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to upload ID card" });
    }
};

const getPendingVerifications = async (req, res) => {
    try {
        const userId = getRequesterId(req);
        const requester = await User.findById(userId);
        if (!requester || requester.role?.toLowerCase() !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }

        const pendingUsers = await User.find({ verificationStatus: "pending" }).select("-password");
        return res.status(200).json({ success: true, message: "Pending verifications retrieved", data: { users: pendingUsers } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch pending verifications" });
    }
};

const reviewVerification = async (req, res) => {
    try {
        const userId = getRequesterId(req);
        const requester = await User.findById(userId);
        if (!requester || requester.role?.toLowerCase() !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }

        const { userId: targetUserId } = req.params;
        const { action } = req.body;
        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ success: false, message: "Action must be approve or reject" });
        }

        const updates = {
            verificationStatus: action === "approve" ? "verified" : "unverified",
            verificationReviewedAt: new Date(),
        };
        if (action === "reject") {
            updates.idCardImage = "";
        }

        const user = await User.findByIdAndUpdate(
            targetUserId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, message: `Verification ${action}ed successfully`, data: { user } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to review verification" });
    }
};

module.exports = {
    getProfile,
    getRatings,
    updateProfile,
    uploadIdCard,
    getPendingVerifications,
    reviewVerification,
    profile: getProfile,
    ratings: getRatings
};

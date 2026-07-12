const User = require("../models/user");

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

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: { user }
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
                completedTrades: user.completedTrades || 0
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

module.exports = {
    getProfile,
    getRatings,
    updateProfile,
    profile: getProfile,
    ratings: getRatings
};

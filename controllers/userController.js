const User = require("../models/user");

/**
 * @desc    Get authenticated user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(250).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                department: user.department,
                bio: user.bio,
                role: user.role,
                rating: user.rating,
                completedTrades: user.completedTrades
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get authenticated user ratings
 * @route   GET /api/users/ratings
 * @access  Private
 */
const getRatings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            rating: user.rating || 0,
            completedTrades: user.completedTrades || 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, avatar, phone, department, bio } = req.body;

        const updatedFields = {};
        if (name !== undefined) updatedFields.name = name;
        if (avatar !== undefined) updatedFields.avatar = avatar;
        if (phone !== undefined) updatedFields.phone = phone;
        if (department !== undefined) updatedFields.department = department;
        if (bio !== undefined) updatedFields.bio = bio;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                department: user.department,
                bio: user.bio,
                role: user.role,
                rating: user.rating,
                completedTrades: user.completedTrades
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    getRatings,
    updateProfile
};

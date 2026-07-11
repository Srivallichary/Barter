const User = require("../models/user");

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id/profile
 * @access  Private
 */
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Profile retrieved successfully", data: { user } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch profile" });
  }
};

/**
 * @desc    Get user ratings (placeholder)
 * @route   GET /api/users/:id/ratings
 * @access  Public
 */
const ratings = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Ratings not implemented", data: { ratings: [] } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch ratings" });
  }
};

module.exports = {
  profile,
  ratings,
};

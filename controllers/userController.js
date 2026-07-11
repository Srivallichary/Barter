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

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user ratings (placeholder)
 * @route   GET /api/users/:id/ratings
 * @access  Public
 */
const ratings = async (req, res) => {
  try {
    res.status(200).json({ success: true, ratings: [], message: "Ratings not implemented" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  profile,
  ratings,
};

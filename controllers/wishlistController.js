const Wishlist = require("../models/wishlist");

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id });
        
        if (!wishlist) {
            // Create an empty wishlist for the user
            wishlist = await Wishlist.create({
                user: req.user.id,
                items: []
            });
        }

        res.status(200).json({
            success: true,
            wishlist: wishlist.items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist/:itemId
 * @access  Private
 */
const addToWishlist = async (req, res) => {
    try {
        const { itemId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                items: []
            });
        }

        if (!wishlist.items.includes(itemId)) {
            wishlist.items.push(itemId);
            await wishlist.save();
        }

        res.status(200).json({
            success: true,
            message: "Item added to wishlist",
            wishlist: wishlist.items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/:itemId
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
    try {
        const { itemId } = req.params;

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (wishlist) {
            wishlist.items = wishlist.items.filter(id => id.toString() !== itemId);
            await wishlist.save();
        }

        res.status(200).json({
            success: true,
            message: "Item removed from wishlist",
            wishlist: wishlist ? wishlist.items : []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};

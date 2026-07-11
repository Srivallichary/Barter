const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

// Get user wishlist
router.get("/", auth, getWishlist);

// Add item to wishlist
router.post("/:itemId", auth, addToWishlist);

// Remove item from wishlist
router.delete("/:itemId", auth, removeFromWishlist);

module.exports = router;

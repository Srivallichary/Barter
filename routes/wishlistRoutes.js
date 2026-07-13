const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  addItemToWishlist,
  removeItemFromWishlist
} = require("../controllers/wishlistController");

router.get("/", auth, getWishlist);
router.post("/", auth, addItemToWishlist);
router.post("/:itemId", auth, addToWishlist);
router.delete("/:itemId", auth, removeItemFromWishlist || removeFromWishlist);

module.exports = router;

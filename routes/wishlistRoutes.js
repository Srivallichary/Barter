const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist
} = require("../controllers/wishlistController");

router.get("/", auth, getWishlist);
router.post("/", auth, addItemToWishlist);
router.delete("/:itemId", auth, removeItemFromWishlist);

module.exports = router;

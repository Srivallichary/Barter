const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist");
const Item = require("../models/item");

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

const getWishlist = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId }).populate("items", "title category status images owner");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: {
        wishlist,
        count: wishlist.items.length
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch wishlist"
    });
  }
};

const addItemToWishlist = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid item id"
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, items: [] });
    }

    const alreadySaved = wishlist.items.some((savedItem) => String(savedItem) === String(itemId));

    if (alreadySaved) {
      return res.status(409).json({
        success: false,
        message: "Item already exists in wishlist"
      });
    }

    wishlist.items.push(itemId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate("items", "title category status images owner");

    return res.status(201).json({
      success: true,
      message: "Item added to wishlist",
      data: { wishlist: updatedWishlist }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add item to wishlist"
    });
  }
};

const removeItemFromWishlist = async (req, res) => {
  try {
    const userId = getRequesterId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(422).json({
        success: false,
        message: "Invalid item id"
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    wishlist.items = wishlist.items.filter((savedItem) => String(savedItem) !== String(itemId));
    await wishlist.save();

    const refreshedWishlist = await Wishlist.findById(wishlist._id).populate("items", "title category status images owner");

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      data: { wishlist: refreshedWishlist }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to remove item from wishlist"
    });
  }
};

module.exports = {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist
};

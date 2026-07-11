const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getSmartMatches
} = require("../controllers/itemController");

// Create Item
router.post("/", auth, createItem);

// Get All Items
router.get("/", getAllItems);

// Get Smart Matches
router.get("/matches/:id", auth, getSmartMatches);

// Get Single Item
router.get("/:id", getItemById);

// Update Item
router.put("/:id", auth, updateItem);

// Delete Item
router.delete("/:id", auth, deleteItem);

module.exports = router;
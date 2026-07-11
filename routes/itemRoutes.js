const express = require("express");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const router = express.Router();

const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getSmartMatches
} = require("../controllers/itemController");

// Create Item
router.post("/", auth, upload.single("image"), createItem);

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
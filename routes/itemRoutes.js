const express = require("express");
const upload = require("../middleware/upload");

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
router.post("/", upload.single("image"), createItem);

// Get All Items
router.get("/", getAllItems);

// Get Smart Matches
router.get("/matches/:id", getSmartMatches);

// Get Single Item
router.get("/:id", getItemById);

// Update Item
router.put("/:id", updateItem);

// Delete Item
router.delete("/:id", deleteItem);

module.exports = router;
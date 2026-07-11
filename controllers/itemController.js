const Item = require("../models/item");
/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Private
 */
const createItem = async (req, res) => {
    try {
        const { title, description, category, image, owner } = req.body;

        // Check required fields
        if (!title || !description || !category || !owner) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description, category and owner"
            });
        }

        const item = await Item.create({
            title,
            description,
            category,
            image,
            owner
        });

        res.status(201).json({
            success: true,
            message: "Item created successfully",
            item
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get all items
 * @route   GET /api/items
 * @access  Public
 */
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();

        res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update an item
 * @route   PUT /api/items/:id
 * @access  Private
 */
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item: updatedItem
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Delete an item
 * @route   DELETE /api/items/:id
 * @access  Private
 */
const deleteItem = async (req, res) => {
    try {
        // Check if item exists
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Delete item
        await Item.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get smart matching items
 * @route   GET /api/items/matches/:id
 * @access  Private
 */
const getSmartMatches = async (req, res) => {
    try {
        // Find the current item
        const currentItem = await Item.findById(req.params.id);

        if (!currentItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Find similar items
        const matches = await Item.find({
            _id: { $ne: currentItem._id },
            category: currentItem.category,
            status: "available",
            owner: { $ne: currentItem.owner }
        });

        res.status(200).json({
            success: true,
            count: matches.length,
            matches
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getSmartMatches
};
const mongoose = require("mongoose");
const Item = require("../models/item");

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Private
 */
const createItem = async (req, res) => {
    try {
        const { title, description, category, condition, location, tags, estimatedValue, status } = req.body;
        const owner = req.body.owner || getRequesterId(req);
        const images = req.files
            ? req.files.map((file) => file.filename)
            : req.file
                ? [req.file.filename]
                : Array.isArray(req.body.images)
                    ? req.body.images
                    : req.body.image
                        ? [req.body.image]
                        : [];

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
            condition,
            images,
            owner,
            location,
            tags,
            estimatedValue,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Item created successfully",
            data: { item }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create item"
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
        const { category, condition, location, keyword, owner, status, sort } = req.query;
        const query = {};

        if (category) query.category = category;
        if (condition) query.condition = condition;
        if (location) query.location = location;
        if (status) query.status = status;
        if (owner) {
            query.owner = mongoose.Types.ObjectId.isValid(owner)
                ? new mongoose.Types.ObjectId(owner)
                : owner;
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { tags: { $regex: keyword, $options: "i" } }
            ];
        }

        let sortOption = { createdAt: -1 };

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "title") {
            sortOption = { title: 1 };
        }

        const items = await Item.find(query).sort(sortOption).populate("owner", "name email");

        return res.status(200).json({
            success: true,
            message: "Items retrieved successfully",
            data: {
                items,
                count: items.length
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch items"
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(422).json({
                success: false,
                message: "Invalid item id"
            });
        }

        const item = await Item.findById(req.params.id).populate("owner", "name email");

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item retrieved successfully",
            data: { item }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch item"
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(422).json({
                success: false,
                message: "Invalid item id"
            });
        }

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (String(item.owner) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this item"
            });
        }

        const updateData = { ...req.body };
        delete updateData.owner;
        delete updateData._id;

        if (req.file) {
            updateData.images = [req.file.filename];
        } else if (req.files) {
            updateData.images = req.files.map((file) => file.filename);
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Item updated successfully",
            data: { item: updatedItem }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update item"
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(422).json({
                success: false,
                message: "Invalid item id"
            });
        }

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (String(item.owner) !== String(requesterId)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this item"
            });
        }

        await Item.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete item"
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(422).json({
                success: false,
                message: "Invalid item id"
            });
        }

        const currentItem = await Item.findById(req.params.id);

        if (!currentItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        const matches = await Item.find({
            _id: { $ne: currentItem._id },
            category: currentItem.category,
            status: "available",
            owner: { $ne: currentItem.owner }
        }).populate("owner", "name email");

        return res.status(200).json({
            success: true,
            message: "Matches retrieved successfully",
            data: {
                matches,
                count: matches.length
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch matches"
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
const mongoose = require("mongoose");
const Item = require("../models/item");

const buildMediaUrl = (filePathOrUrl, req) => {
    if (!filePathOrUrl) return "";
    if (/^https?:\/\//i.test(filePathOrUrl)) return filePathOrUrl;
    if (filePathOrUrl.startsWith("/uploads")) {
        return `${req.protocol}://${req.get("host")}${filePathOrUrl}`;
    }
    if (filePathOrUrl.startsWith("uploads")) {
        return `${req.protocol}://${req.get("host")}/${filePathOrUrl}`;
    }
    return filePathOrUrl;
};

const normalizeItem = (item, req) => {
    if (!item) return item;
    const normalized = item.toObject ? item.toObject() : { ...item };
    normalized.image = buildMediaUrl(normalized.image, req);
    if (Array.isArray(normalized.images)) {
        normalized.images = normalized.images.map((img) => buildMediaUrl(img, req));
    }
    return normalized;
};

const getRequesterId = (req) => req.user?.userId || req.user?.id || req.user?._id;

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Private
 */
const createItem = async (req, res) => {
    try {
        const { title, description, category, condition, location, tags, estimatedValue, status, image } = req.body;
        const owner = getRequesterId(req);
        const images = req.files
            ? req.files.map((file) => file.filename)
            : req.file
                ? [req.file.filename]
                : Array.isArray(req.body.images)
                    ? req.body.images
                    : req.body.image
                        ? [req.body.image]
                        : [];

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, description and category"
            });
        }

        if (!owner) {
            return res.status(401).json({
                success: false,
                message: "Authentication required to create item"
            });
        }

        const item = await Item.create({
            title,
            description,
            category,
            condition,
            images,
            image: image || images[0] || "",
            owner,
            location,
            tags,
            estimatedValue,
            status
        });

        return res.status(201).json({
            success: true,
            message: "Item created successfully",
            data: { item: normalizeItem(item, req) }
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
        if (status) {
            query.status = status;
        } else {
            // Only show available listings by default in the public marketplace
            query.status = "available";
        }

        if (owner) {
            query.owner = mongoose.Types.ObjectId.isValid(owner)
                ? new mongoose.Types.ObjectId(owner)
                : owner;
        } else {
            // Hide stale/orphaned listings that no longer have a valid owner reference
            query.owner = { $exists: true, $ne: null };
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

        const items = await Item.find(query).sort(sortOption).populate("owner", "name email avatar");

        return res.status(200).json({
            success: true,
            message: "Items retrieved successfully",
            data: {
                items: items.map((item) => normalizeItem(item, req)),
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
 * @desc    Get items belonging to the authenticated user
 * @route   GET /api/items/me
 * @access  Private
 */
const getMyItems = async (req, res) => {
    try {
        const requesterId = getRequesterId(req);

        if (!requesterId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const query = { owner: mongoose.Types.ObjectId(requesterId) };
        const items = await Item.find(query).sort({ createdAt: -1 }).populate("owner", "name email avatar");

        return res.status(200).json({
            success: true,
            message: "User items retrieved successfully",
            data: {
                items,
                count: items.length
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user items"
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

        const item = await Item.findById(req.params.id).populate("owner", "name email avatar");

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item retrieved successfully",
            data: { item: normalizeItem(item, req) }
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
            updateData.image = req.file.filename;
        } else if (req.files) {
            updateData.images = req.files.map((file) => file.filename);
            updateData.image = req.files[0]?.filename || "";
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
            data: { item: normalizeItem(updatedItem, req) }
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
        }).populate("owner", "name email avatar");

        return res.status(200).json({
            success: true,
            message: "Matches retrieved successfully",
            data: {
                matches: matches.map((item) => normalizeItem(item, req)),
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
    getMyItems,
    getItemById,
    updateItem,
    deleteItem,
    getSmartMatches
};
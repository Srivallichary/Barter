const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getProfile,
    getRatings,
    updateProfile
} = require("../controllers/userController");

// Get profile
router.get("/profile", auth, getProfile);

// Get ratings
router.get("/ratings", auth, getRatings);

// Update profile
router.put("/profile", auth, updateProfile);

module.exports = router;

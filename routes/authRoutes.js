const express = require("express");

const router = express.Router();

const {
    register,
    login,
    checkUsername
} = require("../controllers/authController");

// Check username availability
router.get("/check-username/:username", checkUsername);

// Register a new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

module.exports = router;
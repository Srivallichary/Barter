const express = require("express");

const router = express.Router();

const {
    register,
    login,
    verifyEmail
} = require("../controllers/authController");

// Register a new user
router.post("/register", register);

// Verify email using the code sent during registration
router.post("/verify-email", verifyEmail);

// Login existing user
router.post("/login", login);

module.exports = router;
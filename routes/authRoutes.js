const express = require("express");

const router = express.Router();

const {
    register,
    login,
    sendOtp,
    verifyOtp,
    checkUsername
} = require("../controllers/authController");

// Send verification OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Check username availability
router.get("/check-username/:username", checkUsername);

// Register a new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

module.exports = router;
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Create user immediately, without OTP gating
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate JWT token so the new user can use the app immediately
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                department: user.department,
                bio: user.bio,
                role: user.role,
                rating: user.rating,
                completedTrades: user.completedTrades,
                verificationStatus: user.verificationStatus,
                idCardImage: user.idCardImage,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Find user by email or username (name)
        const user = await User.findOne({
            $or: [
                { email: email },
                { name: { $regex: new RegExp(`^${email}$`, "i") } }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                department: user.department,
                bio: user.bio,
                role: user.role,
                rating: user.rating,
                completedTrades: user.completedTrades,
                verificationStatus: user.verificationStatus,
                idCardImage: user.idCardImage,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Check username availability
 * @route   GET /api/auth/check-username/:username
 * @access  Public
 */
const checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ name: { $regex: new RegExp(`^${username}$`, "i") } });
        res.status(200).json({
            success: true,
            available: !user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    checkUsername
};
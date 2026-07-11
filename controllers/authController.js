const User = require("../models/user");
const Otp = require("../models/otp");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

/**
 * Helper to send email via SMTP or fallback to console log
 */
const sendEmailOtp = async (email, otp) => {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
        console.log(`\n========================================================`);
        console.log(`[SMTP Config Missing] Generated OTP for ${email}: ${otp}`);
        console.log(`========================================================\n`);
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user,
            pass
        }
    });

    const mailOptions = {
        from: `"Barter Marketplace" <${user}>`,
        to: email,
        subject: "Your Barter Registration OTP",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                <h2 style="color: #4f46e5;">Email Verification Code</h2>
                <p>Welcome to Barter! Use the following one-time password (OTP) to complete your signup. This code is valid for 5 minutes.</p>
                <div style="font-size: 24px; font-weight: bold; color: #1e1b4b; background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #6b7280; font-size: 12px;">If you did not request this code, you can safely ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

/**
 * @desc    Send verification OTP
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email address"
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

        // Cooldown check: Check if an OTP was sent within the last 60 seconds
        const existingOtp = await Otp.findOne({ email });
        if (existingOtp) {
            const diff = Date.now() - new Date(existingOtp.createdAt).getTime();
            if (diff < 60000) {
                const waitTime = Math.ceil((60000 - diff) / 1000);
                return res.status(400).json({
                    success: false,
                    message: `Please wait ${waitTime} seconds before requesting a new code`
                });
            }
        }

        // Generate a 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Upsert OTP record
        await Otp.findOneAndUpdate(
            { email },
            { otp, verified: false, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send OTP
        await sendEmailOtp(email, otp);

        res.status(200).json({
            success: true,
            message: "Verification code sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and verification code"
            });
        }

        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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

        // Check if email has been verified via OTP
        const otpRecord = await Otp.findOne({ email });
        if (!otpRecord || !otpRecord.verified) {
            return res.status(400).json({
                success: false,
                message: "Email address not verified. Please verify your email first."
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

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Delete verified OTP record
        await Otp.deleteOne({ email });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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
                completedTrades: user.completedTrades
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
    sendOtp,
    verifyOtp,
    checkUsername
};
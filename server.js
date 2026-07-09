<<<<<<< HEAD
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const tradeRoutes = require("./routes/tradeRoutes");

dotenv.config();
connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/trades", tradeRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Barter API is running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
=======
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const auth = require('./middleware/auth');

const app = express();

// Middleware that lets Express understand JSON sent in requests
app.use(express.json());

// ---------- ROUTES ----------

// 1. REGISTER — create a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create the user (password gets hashed automatically by User.js)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 2. LOGIN — check credentials, return a JWT token if correct
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check the password using the method we built in User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate a JWT token for this user
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// 3. PROFILE — a protected route, only accessible with a valid token
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ---------- START SERVER ----------

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || 'tradeApp' })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });
>>>>>>> 5b11a74c765ecad1bd6c492e626991f29e278f35

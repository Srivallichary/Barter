require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const upload = require("./middleware/upload");
const Trade = require("./models/trade");
const User = require("./models/user");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.set("io", io);

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        res.status(200).json({
            success: true,
            message: "File uploaded successfully!",
            path: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/items", itemRoutes);
app.use("/items", itemRoutes);

app.use("/api/trades", tradeRoutes);
app.use("/trades", tradeRoutes);

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.use("/api/wishlist", wishlistRoutes);
app.use("/wishlist", wishlistRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/notifications", notificationRoutes);

app.use("/api/messages", messageRoutes);
app.use("/messages", messageRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Barter API is running");
});

io.on("connection", (socket) => {
    socket.on("join-trade", (tradeId) => {
        if (tradeId) {
            socket.join(`trade:${tradeId}`);
        }
    });

    socket.on("leave-trade", (tradeId) => {
        if (tradeId) {
            socket.leave(`trade:${tradeId}`);
        }
    });

    socket.on("trade-message", async ({ tradeId, message }) => {
        try {
            if (!tradeId || !message?.text) return;

            const trade = await Trade.findById(tradeId);
            if (!trade) return;

            const senderUser = await User.findById(message.sender);
            const senderName = senderUser?.name || "Member";
            const savedMessage = {
                sender: message.sender,
                senderName,
                text: message.text,
                createdAt: new Date()
            };

            trade.messages.push(savedMessage);
            await trade.save();

            io.to(`trade:${trade._id}`).emit("trade-message", {
                tradeId: trade._id.toString(),
                message: savedMessage
            });
        } catch (error) {
            socket.emit("trade-message-error", { message: error.message || "Failed to send message" });
        }
    });
});

const PORT = process.env.PORT || 5000;

// --- Startup diagnostics (no secrets printed) ---
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;
const smtpService = process.env.EMAIL_SERVICE;
const smtpHost = process.env.EMAIL_HOST;
const smtpPort = process.env.EMAIL_PORT;

const resendLoaded = !!process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || process.env.RESEND_FROM || null;

const isPlaceholderUser = !smtpUser || /your-|example|changeme/i.test(smtpUser);
const isPlaceholderPass = !smtpPass || /your-|app-password|password|changeme/i.test(smtpPass);
const hasHostOrService = !!(smtpHost || smtpService || (smtpUser && /gmail\.com$/i.test(smtpUser)));

console.log("SMTP provider:", smtpService ? smtpService : smtpHost ? `${smtpHost}:${smtpPort || ""}` : "not configured");
console.log("EMAIL_USER:", smtpUser || "not set");
console.log("SMTP credentials loaded:", !(isPlaceholderUser || isPlaceholderPass) && hasHostOrService);
if (process.env.MAILTRAP_USER) {
    console.log("Mailtrap fallback configured");
}
console.log("Resend API key loaded:", resendLoaded);
console.log("EMAIL_FROM:", emailFrom || "not set");

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

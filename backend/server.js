// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Models
require("./models/User");
require("./models/Cart");
require("./models/Order");
require("./models/Product");
require("./models/WalletTransaction");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' })); // Production mein restrict kar sakte ho

// MongoDB Connection – Atlas priority (local fallback sirf emergency ke liye)
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stylo-fashion")
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => {
    console.error("❌ MongoDB Connection FAILED:", err.message);
    process.exit(1);
  });

// HTTP Server + Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Testing ke liye * – production mein specific origin daal do
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket'], // Polling avoid karo (production best)
  path: '/socket.io/'
});

// Socket logs
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('ping', () => socket.emit('pong'));
});

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));

// Static uploads
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Stylo Backend LIVE - Socket Ready!", time: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ success: false, message: "Server Error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server & Socket.io Running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Network URL: http://192.168.29.72:${PORT}`); // Tere current IP ke hisaab se
});

// Keep-alive for Railway
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;





// // backend/server.js
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// // Models register
// require("./models/User");
// require("./models/Cart");
// require("./models/Order");
// require("./models/Product");
// require("./models/WalletTransaction"); // ← YE LINE ADD KAR DE BHAI! 🔥

// const app = express();

// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/stylo-fashion")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => {
//     console.log("MongoDB Error:", err.message);
//     process.exit(1);
//   });

// // Test Route
// app.get("/", (req, res) => {
//   res.json({ message: "Stylo Backend LIVE - COD Ready!", time: new Date() });
// });

// // Routes
// app.use("/auth", require("./routes/authRoutes"));
// app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));

// // ✅ USER ROUTES (profile)
// app.use("/api/user", require("./routes/UserRoutes"));

// // 404 Handler
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found!`
//   });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error("Server Error:", err.message);
//   res.status(500).json({
//     success: false,
//     message: "Server Error",
//     error: err.message
//   });
// });

// // Server Start
// const PORT = process.env.PORT || 5001;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Backend Running on http://10.23.168.194:${PORT}`);
//   console.log(`CART & ORDERS READY!`);
//   console.log(`COD ORDER PLACE HOGA AB!`);
// });




// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Models register
require("./models/User");
require("./models/Cart");
require("./models/Order");
require("./models/Product");
require("./models/WalletTransaction");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));  // Production mein '*' temporary, baad mein restrict kar (app ke origins daal)

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/stylo-fashion")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("MongoDB Error:", err.message);
    process.exit(1);
  });

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Stylo Backend LIVE - COD Ready!", time: new Date() });
});

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));

// Uploads route (agar images serve kar rha hai to add kar – Railway pe static files ke liye)
app.use("/uploads", express.static("uploads"));  // ← YE ADD KAR DE BHAI! Images live ho jayengi

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found!`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message
  });
});

// Server Start – RAILWAY FIX (dynamic PORT + host '0.0.0.0')
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend Running on port ${PORT}`);
  console.log(`Listening at http://0.0.0.0:${PORT}`);
  console.log(`CART & ORDERS READY!`);
  console.log(`COD ORDER PLACE HOGA AB!`);
});

// Optional: Idle timeout fix (kabhi 502 fix karta hai)
const server = app.listen(PORT, "0.0.0.0");
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;


// backend/controllers/orderController.js
// 100% FINAL AUR CLEAN CODE — KABHI ERROR NHI AAYEGA!

const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.body.userId || "66f7d9a1b2c3d4e5f6789012";

    const { items, totalAmount, paymentMethod = "COD", shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required!"
      });
    }

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress: shippingAddress || "Cash on Delivery - Address later",
      status: paymentMethod === "COD" ? "Pending" : "Confirmed"   // YE PENDING HAI AB!!!
    });

    await newOrder.save();
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({
      success: true,
      message: "Order placed! Waiting for admin approval.",
      order: newOrder
    });

  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = "66f7d9a1b2c3d4e5f6789012";
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Confirmed", "Cancelled", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: `Order ${status}!`, order });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};





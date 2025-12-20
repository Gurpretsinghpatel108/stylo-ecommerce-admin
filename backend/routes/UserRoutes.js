// backend/routes/userRoutes.js   ← ABSOLUTE FINAL & PERFECT VERSION WITH WALLET HISTORY

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction"); // ← YE ADD KIYA HAI

// GET USER PROFILE
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        photo: user.photo || "",
        wallet: user.wallet || 0,
      },
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// UPDATE USER PROFILE
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
      return res.status(400).json({ success: false, message: "Kuch toh change kar bhai!" });
    }

    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ success: false, message: "Email already taken" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || req.user.name,
        email: email || req.user.email,
        phone: phone || req.user.phone,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        photo: updatedUser.photo || "",
        wallet: updatedUser.wallet || 0,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ADD MONEY TO WALLET + CREATE CREDIT TRANSACTION
router.post("/add-money", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount daal bhai!" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const newBalance = user.wallet + Number(amount);

    // Update wallet balance
    user.wallet = newBalance;
    await user.save();

    // Create credit transaction
    await WalletTransaction.create({
      user: user._id,
      type: "credit",
      amount: Number(amount),
      description: "Money added to wallet",
      balanceAfter: newBalance,
    });

    res.json({
      success: true,
      message: `₹${amount} wallet mein add ho gaya!`,
      wallet: newBalance,
    });
  } catch (err) {
    console.error("Add money error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DEDUCT FROM WALLET + CREATE DEBIT TRANSACTION
router.post("/use-wallet", protect, async (req, res) => {
  try {
    const { amountToDeduct, orderId, description = "Payment via wallet" } = req.body;

    if (!amountToDeduct || amountToDeduct <= 0) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.wallet < amountToDeduct) {
      return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
    }

    const newBalance = user.wallet - Number(amountToDeduct);

    // Update wallet balance
    user.wallet = newBalance;
    await user.save();

    // Create debit transaction
    await WalletTransaction.create({
      user: user._id,
      type: "debit",
      amount: Number(amountToDeduct),
      description,
      order: orderId || null,
      balanceAfter: newBalance,
    });

    res.json({
      success: true,
      message: "Wallet payment successful!",
      newBalance,
    });
  } catch (err) {
    console.error("Wallet deduction error:", err);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// GET WALLET HISTORY (PAGINATED)
router.get("/wallet-history", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await WalletTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WalletTransaction.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      transactions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Wallet history fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch wallet history" });
  }
});

module.exports = router;
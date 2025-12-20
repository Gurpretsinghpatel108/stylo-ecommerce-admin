// models/WalletTransaction.js
const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Fast queries ke liye
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatically add ho jayega
  }
);

// Latest transactions pehle dikhe
walletTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
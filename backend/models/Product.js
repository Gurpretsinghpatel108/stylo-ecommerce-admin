// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: [String] },
  category: { type: String },
  description: { type: String },
  sizes: { type: [String] },
  colors: { type: [String] },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      selectedSize: String
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  shippingAddress: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);






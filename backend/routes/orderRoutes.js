

// backend/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,         // ← NEW
  updateOrderStatus,    // ← NEW
  getOrderById          // ← NEW (for tracking)
} = require('../controllers/orderController');

// Sab open hai abhi (no auth)
router.post('/create', createOrder);
router.get('/myorders', getUserOrders);        // ab yeh bhi sab orders dega
router.get('/all', getAllOrders);              // ← Admin ke liye clean route
router.get('/:id', getOrderById);              // ← Tracking ke liye
router.put('/update-status/:id', updateOrderStatus); // ← Status change

module.exports = router;
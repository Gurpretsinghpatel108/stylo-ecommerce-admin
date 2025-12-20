const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncCart } = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update/:productId', protect, updateCartItem);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);
router.post('/sync', protect, syncCart);

module.exports = router;

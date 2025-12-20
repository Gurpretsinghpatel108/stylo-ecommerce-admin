// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user (without password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Attach user to req
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// ----------------------
// EXPORT CORRECTLY
// ----------------------
module.exports = protect;

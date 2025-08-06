const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('Auth headers:', req.headers.authorization);
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token ? 'Yes' : 'No');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Token decoded:', decoded);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('User not found for token');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('User authenticated:', req.user.name);
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect }; 
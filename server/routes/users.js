const express = require('express');
const router = express.Router();
const {
  getUserById,
  getUserProfile,
  searchUsers,
} = require('../controllers/userController');

// Public routes
router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.get('/:id/profile', getUserProfile);

module.exports = router; 
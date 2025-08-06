const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserById,
  getUserProfile,
  searchUsers,
  followUser,
  getFollowers,
  getFollowing,
  updateOnlineStatus
} = require('../controllers/userController');

// Public routes
router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.get('/:id/profile', getUserProfile);

// Protected routes
router.use(protect);
router.put('/:id/follow', followUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.put('/status', updateOnlineStatus);

module.exports = router; 
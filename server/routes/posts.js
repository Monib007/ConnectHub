const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  getPostsByUser,
  deletePost,
  likePost,
  addComment,
  removeComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/user/:userId', getPostsByUser);

// Protected routes
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, removeComment);

module.exports = router; 
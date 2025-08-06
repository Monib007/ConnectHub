const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');
const {
  createPost,
  getPosts,
  getPostById,
  getPostsByUser,
  deletePost,
  likePost,
  addComment,
  removeComment,
  sharePost
} = require('../controllers/postController');

// Public routes
router.get('/', getPosts);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getPostById);

// Protected routes
router.use(protect);
router.post('/', uploadMultiple, handleUploadError, createPost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', removeComment);
router.post('/:id/share', sharePost);

module.exports = router; 
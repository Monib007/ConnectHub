const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');

// All routes are protected
router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getConversation);
router.put('/conversation/:userId/read', markAsRead);
router.delete('/:id', deleteMessage);
router.get('/unread-count', getUnreadCount);

module.exports = router; 
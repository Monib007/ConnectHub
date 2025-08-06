const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,
    maxlength: [1000, 'Post cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String,
    default: []
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isShared: {
    type: Boolean,
    default: false
  },
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function() {
  return this.shares.length;
});

// Index for search functionality
postSchema.index({ content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
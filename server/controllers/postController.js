const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = await Post.create({
      content: content.trim(),
      author: req.user._id
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post has already been liked by user
    const alreadyLiked = post.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name');

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.unshift({
      user: req.user._id,
      text: text.trim()
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name');

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove comment from post
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
const removeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.id)
      .indexOf(req.params.commentId);

    post.comments.splice(removeIndex, 1);

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate('comments.user', 'name');

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostsByUser,
  deletePost,
  likePost,
  addComment,
  removeComment,
}; 
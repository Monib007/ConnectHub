const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create post
const createPost = async (req, res) => {
  try {
    const { content, tags, location, isPublic } = req.body;
    const author = req.user.id;
    
    // Handle file uploads
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    // Parse tags if they come as a string
    const parsedTags = tags ? (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags) : [];

    // Validate that post has either content or images
    if ((!content || !content.trim()) && images.length === 0) {
      return res.status(400).json({ message: 'Post must have either content or images' });
    }

    console.log('Creating post with:', {
      content,
      author,
      images,
      tags: parsedTags,
      location,
      isPublic
    });

    const post = await Post.create({
      content: content || '',
      author,
      images,
      tags: parsedTags,
      location,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');

    console.log('Post created successfully:', populatedPost._id);
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Get all posts with advanced filtering
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, author, sort = 'newest' } = req.query;
    const skip = (page - 1) * limit;

    let query = { isPublic: true };

    // Search functionality
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Sorting options
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { likeCount: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar')
      .populate('originalPost')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add virtual fields manually
    const postsWithVirtuals = posts.map(post => ({
      ...post,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0,
      shareCount: post.shares ? post.shares.length : 0
    }));

    const total = await Post.countDocuments(query);

    res.json({
      posts: postsWithVirtuals,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar')
      .populate('originalPost');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get posts by user
const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      author: userId, 
      isPublic: true 
    })
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Add virtual fields manually
    const postsWithVirtuals = posts.map(post => ({
      ...post,
      likeCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0,
      shareCount: post.shares ? post.shares.length : 0
    }));

    const total = await Post.countDocuments({ author: userId, isPublic: true });

    res.json({
      posts: postsWithVirtuals,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error getting user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/Unlike post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);

      // Create notification if not liking own post
      if (post.author.toString() !== userId) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'like',
          post: post._id,
          message: `${req.user.name} liked your post`
        });
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      text
    };

    post.comments.unshift(comment);
    await post.save();

    // Create notification if not commenting on own post
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: 'comment',
        post: post._id,
        comment: comment._id,
        message: `${req.user.name} commented on your post`
      });
    }

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove comment
const removeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id && post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.comments = post.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');

    res.json(updatedPost);
  } catch (error) {
    console.error('Error removing comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Share post
const sharePost = async (req, res) => {
  try {
    const { content } = req.body;
    const originalPostId = req.params.id;
    const author = req.user.id;

    const originalPost = await Post.findById(originalPostId);
    if (!originalPost) {
      return res.status(404).json({ message: 'Original post not found' });
    }

    const sharedPost = await Post.create({
      content: content || '',
      author,
      originalPost: originalPostId,
      isShared: true
    });

    // Add to original post's shares
    originalPost.shares.push({
      user: author,
      sharedAt: new Date()
    });
    await originalPost.save();

    // Create notification
    if (originalPost.author.toString() !== author) {
      await Notification.create({
        recipient: originalPost.author,
        sender: author,
        type: 'share',
        post: originalPostId,
        message: `${req.user.name} shared your post`
      });
    }

    const populatedPost = await Post.findById(sharedPost._id)
      .populate('author', 'name avatar')
      .populate('originalPost')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error sharing post:', error);
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
  sharePost
}; 
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile with posts
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ author: req.params.id, isPublic: true })
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      user,
      posts
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q ? { name: { $regex: q, $options: 'i' } } : {};
    
    const users = await User.find(query)
      .select('name email avatar bio followerCount followingCount')
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow user
const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (currentUserId === id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        userId => userId.toString() !== id
      );
      userToFollow.followers = userToFollow.followers.filter(
        userId => userId.toString() !== currentUserId
      );
    } else {
      // Follow
      currentUser.following.push(id);
      userToFollow.followers.push(currentUserId);

      // Create notification
      await Notification.create({
        recipient: id,
        sender: currentUserId,
        type: 'follow',
        message: `${currentUser.name} started following you`
      });
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's followers
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'name avatar bio')
      .select('followers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's following
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'name avatar bio')
      .select('following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user online status
const updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date()
    });

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating online status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserById,
  getUserProfile,
  searchUsers,
  followUser,
  getFollowers,
  getFollowing,
  updateOnlineStatus
}; 
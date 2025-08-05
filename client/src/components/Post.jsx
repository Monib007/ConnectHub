import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  TrashIcon,
  HeartIcon as HeartSolidIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilledIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const Post = ({ post, onDelete, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const isLiked = post.likes?.some(like => like._id === user?._id || like === user?._id);
  const isAuthor = post.author._id === user?._id || post.author === user?._id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;
    
    setIsLiking(true);
    try {
      const response = await axios.put(`/posts/${post._id}/like`);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setIsCommenting(true);
    try {
      const response = await axios.post(`/posts/${post._id}/comment`, {
        text: newComment
      });
      onUpdate(response.data);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/posts/${post._id}/comment/${commentId}`);
      onUpdate(response.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/posts/${post._id}`);
        onDelete(post._id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {/* Post Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
              <span className="text-white fw-semibold">
                {post.author.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <Link 
                to={`/user/${post.author._id || post.author}`}
                className="fw-semibold text-dark text-decoration-none"
              >
                {post.author.name}
              </Link>
              <p className="text-muted small mb-0">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {isAuthor && (
            <button
              onClick={handleDeletePost}
              className="btn btn-link text-danger p-0"
            >
              <TrashIcon style={{width: '20px', height: '20px'}} />
            </button>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-dark">{post.content}</p>
        </div>

        {/* Post Actions */}
        <div className="d-flex align-items-center justify-content-between border-top pt-3">
          <div className="d-flex align-items-center">
            <button
              onClick={handleLike}
              disabled={isLiking || !isAuthenticated}
              className={`btn btn-link d-flex align-items-center me-3 p-0 ${
                isLiked 
                  ? 'text-danger' 
                  : 'text-muted'
              } ${!isAuthenticated ? 'disabled' : ''}`}
            >
              {isLiked ? (
                <HeartFilledIcon className="me-1" style={{width: '20px', height: '20px'}} />
              ) : (
                <HeartIcon className="me-1" style={{width: '20px', height: '20px'}} />
              )}
              <span>{post.likes?.length || 0}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="btn btn-link d-flex align-items-center text-muted p-0"
            >
              <ChatBubbleLeftIcon className="me-1" style={{width: '20px', height: '20px'}} />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 border-top pt-3">
            {/* Add Comment */}
            {isAuthenticated && (
              <form onSubmit={handleComment} className="mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="form-control"
                    disabled={isCommenting}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isCommenting}
                    className="btn btn-primary"
                  >
                    {isCommenting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div>
              {post.comments?.map((comment) => (
                <div key={comment._id} className="bg-light rounded p-3 mb-2">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '24px', height: '24px'}}>
                        <span className="text-white small fw-semibold">
                          {comment.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="fw-medium small me-2">{comment.user.name}</span>
                      <small className="text-muted">
                        {formatDate(comment.createdAt)}
                      </small>
                    </div>
                    {(comment.user._id === user?._id || comment.user === user?._id) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn btn-link text-danger p-0 small"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="small text-dark mt-1 mb-0">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post; 
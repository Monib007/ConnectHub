import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import axios from 'axios';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/posts?page=${pageNum}&limit=10`);
      const { posts: newPosts, totalPages, currentPage } = response.data;
      
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(currentPage < totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => 
      prev.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="h2 fw-bold text-dark mb-4">ConnectHub Feed</h1>
          
          {isAuthenticated && (
            <CreatePost onPostCreated={handlePostCreated} />
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div>
            {posts.length === 0 && !loading ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5">No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map(post => (
                <Post
                  key={post._id}
                  post={post}
                  onUpdate={handlePostUpdate}
                  onDelete={handlePostDelete}
                />
              ))
            )}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 
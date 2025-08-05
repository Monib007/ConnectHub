import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="custom-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="animate-fade-in-up">
            <h1 className="h2 fw-bold gradient-text mb-4 text-center">
              <span className="animate-pulse">🌟</span> ConnectHub Feed <span className="animate-pulse">🌟</span>
            </h1>
            
            {isAuthenticated && (
              <div className="animate-slide-in-left">
                <CreatePost onPostCreated={handlePostCreated} />
              </div>
            )}

            {error && (
              <div className="alert alert-danger animate-fade-in-up" role="alert">
                <strong>Oops!</strong> {error}
              </div>
            )}

            <div>
              {posts.length === 0 && !loading ? (
                <div className="text-center py-5 animate-fade-in-up">
                  <div className="mb-4">
                    <span className="display-1">📝</span>
                  </div>
                  <h3 className="gradient-text mb-3">No posts yet</h3>
                  <p className="text-muted fs-5 mb-4">Be the first to share something amazing!</p>
                  {!isAuthenticated && (
                    <Link to="/register" className="btn btn-primary btn-lg hover-lift">
                      Join ConnectHub
                    </Link>
                  )}
                </div>
              ) : (
                <div>
                  {posts.map((post, index) => (
                    <div 
                      key={post._id} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Post
                        post={post}
                        onUpdate={handlePostUpdate}
                        onDelete={handlePostDelete}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasMore && (
              <div className="text-center mt-5 animate-fade-in-up">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn btn-primary btn-lg hover-lift"
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <span>📄</span> Load More Posts
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
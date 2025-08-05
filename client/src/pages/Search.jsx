import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Post from '../components/Post';
import axios from 'axios';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Search posts
      const postsResponse = await axios.get(`/posts?search=${encodeURIComponent(query)}`);
      
      // Search users
      const usersResponse = await axios.get(`/users/search?q=${encodeURIComponent(query)}`);
      
      setResults({
        posts: postsResponse.data.posts || [],
        users: usersResponse.data || []
      });
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setResults(prev => ({
      ...prev,
      posts: prev.posts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    }));
  };

  const handlePostDelete = (postId) => {
    setResults(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post._id !== postId)
    }));
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
          <div className="custom-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="animate-fade-in-up">
        <div className="text-center mb-4">
          <h1 className="h2 fw-bold gradient-text mb-3">
            🔍 Search Results
          </h1>
          <p className="text-muted">
            Showing results for: <span className="fw-bold text-primary">"{query}"</span>
          </p>
        </div>

        {error && (
          <div className="alert alert-danger animate-fade-in-up" role="alert">
            <strong>⚠️ Search Error:</strong> {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${activeTab === 'posts' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('posts')}
            >
              📝 Posts ({results.posts.length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users ({results.users.length})
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {activeTab === 'posts' ? (
              <div>
                {results.posts.length === 0 ? (
                  <div className="text-center py-5 animate-fade-in-up">
                    <div className="mb-4">
                      <span className="display-1">🔍</span>
                    </div>
                    <h3 className="gradient-text mb-3">No posts found</h3>
                    <p className="text-muted fs-5">Try searching with different keywords</p>
                  </div>
                ) : (
                  <div>
                    {results.posts.map((post, index) => (
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
            ) : (
              <div>
                {results.users.length === 0 ? (
                  <div className="text-center py-5 animate-fade-in-up">
                    <div className="mb-4">
                      <span className="display-1">👥</span>
                    </div>
                    <h3 className="gradient-text mb-3">No users found</h3>
                    <p className="text-muted fs-5">Try searching with different names</p>
                  </div>
                ) : (
                  <div>
                    {results.users.map((user, index) => (
                      <div 
                        key={user._id} 
                        className="card shadow-sm mb-3 hover-lift animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                              <span className="text-white fw-bold fs-5">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="mb-1">
                                <Link 
                                  to={`/user/${user._id}`}
                                  className="text-decoration-none text-dark hover-scale"
                                >
                                  {user.name}
                                </Link>
                              </h5>
                              <p className="text-muted mb-1">{user.email}</p>
                              {user.bio && (
                                <p className="text-muted small mb-0">{user.bio}</p>
                              )}
                            </div>
                            <Link 
                              to={`/user/${user._id}`}
                              className="btn btn-primary btn-sm hover-lift"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search; 
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';
import axios from 'axios';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/users/${userId}/profile`);
      setUser(response.data.user);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('User not found or profile unavailable.');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center py-5">
              <p className="text-muted fs-5">User not found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-4" style={{width: '80px', height: '80px'}}>
                  <span className="text-white fw-bold fs-2">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="h3 fw-bold text-dark mb-1">{user.name}</h1>
                  <p className="text-muted mb-1">{user.email}</p>
                  {user.bio && (
                    <p className="text-dark mb-0">{user.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="h3 fw-bold text-dark mb-4">
              Posts by {user.name}
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5">
                  {user.name} hasn't posted anything yet.
                </p>
              </div>
            ) : (
              <div>
                {posts.map(post => (
                  <Post
                    key={post._id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
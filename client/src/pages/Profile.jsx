import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserPosts();
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/posts/user/${user._id}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } else {
      setError(result.message);
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-4" style={{width: '80px', height: '80px'}}>
                    <span className="text-white fw-bold fs-2">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="h3 fw-bold text-dark mb-1">{user?.name}</h1>
                    <p className="text-muted mb-0">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn btn-primary"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        maxLength="500"
                        className="form-control"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="form-text">
                        {formData.bio.length}/500 characters
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h3 className="h5 fw-semibold text-dark mb-2">Bio</h3>
                  <p className="text-dark">
                    {user?.bio || 'No bio added yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="h3 fw-bold text-dark mb-4">Your Posts</h2>
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-5">You haven't posted anything yet.</p>
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

export default Profile; 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.bio
    );
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '48px', height: '48px'}}>
                    <span className="text-white fw-bold fs-4">C</span>
                  </div>
                  <h2 className="h3 fw-bold text-dark">
                    Create your ConnectHub account
                  </h2>
                  <p className="text-muted">
                    Or{' '}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-medium text-primary"
                    >
                      sign in to your existing account
                    </Link>
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-control"
                        autoComplete="name"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        autoComplete="email"
                        required
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        autoComplete="new-password"
                        required
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="form-control"
                        autoComplete="new-password"
                        required
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-12 mb-4">
                      <label htmlFor="bio" className="form-label">
                        Bio (Optional)
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="3"
                        maxLength="500"
                        className="form-control"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={handleChange}
                      />
                      <div className="form-text">
                        {formData.bio.length}/500 characters
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100"
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg animate-fade-in-up hover-lift">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded d-flex align-items-center justify-content-center mx-auto mb-3 animate-pulse" style={{width: '60px', height: '60px'}}>
                    <span className="text-white fw-bold fs-2">🌟</span>
                  </div>
                  <h2 className="h3 fw-bold gradient-text mb-2">
                    Welcome Back!
                  </h2>
                  <p className="text-muted">
                    Sign in to continue your journey on ConnectHub
                  </p>
                  <p className="text-muted small">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-decoration-none fw-medium text-primary hover-scale"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger animate-fade-in-up" role="alert">
                      <strong>⚠️ Oops!</strong> {error}
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">
                      📧 Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      autoComplete="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-medium">
                      🔒 Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 btn-lg hover-lift"
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <span>🚀</span> Sign In
                      </>
                    )}
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

export default Login; 
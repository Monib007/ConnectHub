import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  UserPlusIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container">
        <div className="navbar-brand d-flex align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <div className="bg-primary rounded d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
              <span className="text-white fw-bold fs-5">C</span>
            </div>
            <span className="fs-4 fw-bold text-dark">ConnectHub</span>
          </Link>
        </div>

        <div className="navbar-nav ms-auto d-flex align-items-center">
          <Link 
            to="/" 
            className="nav-link d-flex align-items-center me-3"
          >
            <HomeIcon className="me-1" style={{width: '20px', height: '20px'}} />
            <span>Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="nav-link d-flex align-items-center me-3"
              >
                <UserIcon className="me-1" style={{width: '20px', height: '20px'}} />
                <span>Profile</span>
              </Link>
              <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm d-flex align-items-center"
                >
                  <ArrowRightOnRectangleIcon className="me-1" style={{width: '20px', height: '20px'}} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center">
              <Link 
                to="/login" 
                className="nav-link me-3"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm d-flex align-items-center"
              >
                <UserPlusIcon className="me-1" style={{width: '20px', height: '20px'}} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
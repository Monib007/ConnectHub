import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'John liked your post', time: '2m ago', read: false },
    { id: 2, message: 'New comment on your post', time: '5m ago', read: false },
    { id: 3, message: 'Welcome to ConnectHub!', time: '1h ago', read: true }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-light animate-fade-in-up">
      <div className="container">
        <div className="navbar-brand d-flex align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none hover-scale">
            <div className="bg-primary rounded d-flex align-items-center justify-content-center me-2 animate-pulse" style={{width: '32px', height: '32px'}}>
              <span className="text-white fw-bold fs-5">C</span>
            </div>
            <span className="fs-4 fw-bold gradient-text">ConnectHub</span>
          </Link>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex-grow-1 mx-4 animate-slide-in-left">
            <form onSubmit={handleSearch} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search posts, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-primary">
                <MagnifyingGlassIcon style={{width: '18px', height: '18px'}} />
              </button>
            </form>
          </div>
        )}

        <div className="navbar-nav ms-auto d-flex align-items-center">
          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn btn-link nav-link d-flex align-items-center me-2"
          >
            <MagnifyingGlassIcon style={{width: '20px', height: '20px'}} />
          </button>

          <Link 
            to="/" 
            className="nav-link d-flex align-items-center me-3 hover-scale"
          >
            <HomeIcon className="me-1" style={{width: '20px', height: '20px'}} />
            <span className="d-none d-md-inline">Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="dropdown me-3">
                <button className="btn btn-link nav-link position-relative" data-bs-toggle="dropdown">
                  <BellIcon style={{width: '20px', height: '20px'}} />
                  {unreadNotifications > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate-bounce">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end animate-fade-in-up">
                  {notifications.map(notification => (
                    <li key={notification.id}>
                      <a className={`dropdown-item ${!notification.read ? 'fw-bold' : ''}`} href="#">
                        <div className="d-flex justify-content-between">
                          <span>{notification.message}</span>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="btn btn-link nav-link me-3"
              >
                {isDarkMode ? <SunIcon style={{width: '20px', height: '20px'}} /> : <MoonIcon style={{width: '20px', height: '20px'}} />}
              </button>

              <Link 
                to="/profile" 
                className="nav-link d-flex align-items-center me-3 hover-scale"
              >
                <UserIcon className="me-1" style={{width: '20px', height: '20px'}} />
                <span className="d-none d-md-inline">Profile</span>
              </Link>
              
              <div className="d-flex align-items-center">
                <span className="text-muted me-3 d-none d-lg-inline">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm d-flex align-items-center hover-lift"
                >
                  <ArrowRightOnRectangleIcon className="me-1" style={{width: '20px', height: '20px'}} />
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center">
              <Link 
                to="/login" 
                className="nav-link me-3 hover-scale"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm d-flex align-items-center hover-lift"
              >
                <UserPlusIcon className="me-1" style={{width: '20px', height: '20px'}} />
                <span className="d-none d-sm-inline">Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
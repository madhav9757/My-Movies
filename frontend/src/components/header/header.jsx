import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import './header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const handleNavigate = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  // Helper to check if current route is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo" onClick={() => handleNavigate('/')}>🌟 MyApp</div>

        <nav className="nav">
          <button
            onClick={() => handleNavigate('/')}
            className={`nav-btn ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </button>

          {userInfo ? (
            <>
            <button
                onClick={() => handleNavigate('/movies')}
                className={`nav-btn ${isActive('/movies') ? 'active' : ''}`}
              >
                Movies
              </button>
              <button
                onClick={() => handleNavigate('/genres')}
                className={`nav-btn ${isActive('/genres') ? 'active' : ''}`}
              >
                Genres
              </button>
              <button
                onClick={() => handleNavigate('/profile')}
                className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}
              >
                Profile
              </button>
              <button
                onClick={logoutHandler}
                className="nav-btn logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigate('/login')}
                className={`nav-btn ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate('/signup')}
                className={`nav-btn signup-btn ${isActive('/signup') ? 'active' : ''}`}
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

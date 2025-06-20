import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../redux/features/auth/authSlice.js';
import './home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { userInfo: user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && localStorage.getItem('userInfo')) {
      dispatch(setCredentials(JSON.parse(localStorage.getItem('userInfo'))));
    }
  }, [user, dispatch]);

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>🎬 Welcome to MovieVerse</h1>
        <p>Explore, rate, and discover amazing films across all genres.</p>

        {!user ? (
          <div className="home-auth-buttons">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        ) : (
          <p className="welcome-user">Welcome back, {user.name} 👋</p>
        )}

        <Link to="/admin/genres" className="browse-btn">Browse Genres</Link>
      </div>
    </div>
  );
};

export default Home;

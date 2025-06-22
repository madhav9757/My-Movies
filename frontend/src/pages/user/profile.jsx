import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/features/auth/authSlice.js';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      dispatch(setCredentials(JSON.parse(storedUser)));
    }
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Profile Information</h2>

        {userInfo && (
          <>
            {userInfo.image && (
              <img
                src={userInfo.image}
                alt="Profile"
                className="profile-image"
              />
            )}
            <div className="profile-details">
              <p>
                <span className="icon">👤</span>
                <strong>Name:</strong> <span>{userInfo.name}</span>
              </p>
              <p>
                <span className="icon">📧</span>
                <strong>Email:</strong> <span>{userInfo.email}</span>
              </p>
              {userInfo.createdAt && (
                <p>
                  <span className="icon">📅</span>
                  <strong>Joined:</strong> <span>{new Date(userInfo.createdAt).toLocaleDateString()}</span>
                </p>
              )}
            </div>
          </>
        )}

        <button className='profile-edit-btn' onClick={() => navigate('/profile/edit')}>✏️ Edit Profile</button>
      </div>
    </div>
  );
};

export default Profile;

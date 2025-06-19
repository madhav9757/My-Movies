import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
          <div className="profile-details">
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            {userInfo.createdAt && (
              <p><strong>Joined:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        )}

        <button onClick={() => navigate('/profile/edit')}>✏️ Edit Profile</button>

      </div>
    </div>
  );
};

export default Profile;

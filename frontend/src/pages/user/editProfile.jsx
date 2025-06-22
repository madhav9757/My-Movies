import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfileMutation, useGetProfileQuery } from '../../redux/api/profile';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './editProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: profile, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading, isSuccess, isError, error }] = useUpdateProfileMutation();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
  });

  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        password: '',
        image: profile.image || '',
      });
      setPreview(profile.image || '');
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageURLChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, image: value }));
    setPreview(value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);

      if (formData.image && typeof formData.image !== 'string') {
        data.append('image', formData.image); // file
      } else if (typeof formData.image === 'string') {
        data.append('image', formData.image); // URL
      }

      const updated = await updateProfile(data).unwrap();
      dispatch(setCredentials(updated));
      localStorage.setItem('userInfo', JSON.stringify(updated));
      navigate('/profile');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="New Password (optional)"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="image-input-wrapper">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="file-icon-button"
          >
            📁
          </button>
          <input
            type="text"
            placeholder="Paste image URL or choose file"
            value={typeof formData.image === 'string' ? formData.image : ''}
            onChange={handleImageURLChange}
            className="image-url-input"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>

        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <button type="submit" className="save-changes-button" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Save Changes'}
        </button>

        {isSuccess && <p className="success-msg">✅ Profile updated successfully!</p>}
        {isError && <p className="error-msg">❌ {error?.data?.message || 'Update failed'}</p>}
      </form>
    </div>
  );
};

export default EditProfile;

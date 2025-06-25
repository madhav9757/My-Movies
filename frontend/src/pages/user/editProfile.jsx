import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfileMutation, useGetProfileQuery } from '../../redux/api/profile';
import { useUploadMovieImageMutation } from '../../redux/api/movies.js';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './editProfile.css';
import ImageInput from '../../components/uploadImageInput.jsx';

const EditProfile = () => {

  const API = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [uploadImage] = useUploadMovieImageMutation();
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading, isSuccess, isError, error }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
  });
  const [imageSource, setImageSource] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        password: '',
        image: profile.image || '',
      });
      const fullImageUrl = profile.image?.startsWith('http')
        ? profile.image
        : `${API}${profile.image}`;
      setPreviewUrl(fullImageUrl);
    }
  }, [profile, setFormData]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageInput = async (file) => {
    if (file instanceof File) {
      const imageData = new FormData();
      imageData.append('image', file);
      try {
        const { image } = await uploadImage(imageData).unwrap();
        const fullImageUrl = image.startsWith('http') ? image : `${API}${image}`;
        setFormData((prev) => ({ ...prev, image: fullImageUrl }));
        setPreviewUrl(fullImageUrl);
        setImageSource('upload');
      } catch (err) {
        console.error('Image upload failed:', err);
        alert('Image upload failed. Please try again.');
      }
    } else {
      // It's a URL
      setFormData((prev) => ({ ...prev, image: value }));
      setPreviewUrl(file);
      setImageSource('url');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        image: formData.image,
      };

      if (formData.password) {
        dataToSubmit.password = formData.password;
      }

      const updated = await updateProfile(dataToSubmit).unwrap();
      dispatch(setCredentials(updated));
      localStorage.setItem('userInfo', JSON.stringify(updated));
      navigate('/profile');
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Profile update failed: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2>🛠️ Edit Profile</h2>

        <div className="profile-grid">
          <div className="profile-left">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="New Password (optional)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-changes-button" disabled={isLoading}>
              💾 {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>

          <div className="profile-right">
            <ImageInput
              value={formData.image}
              onChange={handleImageInput}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />
          </div>
        </div>


        {isSuccess && <p className="success-msg">✅ Profile updated successfully!</p>}
        {isError && <p className="error-msg">❌ {error?.data?.message || 'Update failed'}</p>}
      </form>
    </div>
  );
};

export default EditProfile;

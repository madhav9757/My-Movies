import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfileMutation, useGetProfileQuery } from '../../redux/api/profile';
import { useUploadImageMutation } from '../../redux/api/movies';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './editProfile.css';
import ImageInput from '../../components/uploadImageInput.jsx';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [uploadImage] = useUploadImageMutation();

  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading, isSuccess, isError, error }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
  });

  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        password: '',
        image: profile.image || '',
      });
      setPreviewUrl(profile.image || '');
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageInput = async (input) => {
    if (input instanceof File) {
      const formData = new FormData();
      formData.append('image', input);
      try {
        const { image } = await uploadImage(formData).unwrap();
        setFormData((prev) => ({ ...prev, image }));
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed. Please try again.");
      }
    } else {
      setFormData((prev) => ({ ...prev, image: input }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('email', formData.email);
      if (formData.password) dataToSubmit.append('password', formData.password);
      dataToSubmit.append('image', formData.image);

      const updated = await updateProfile(dataToSubmit).unwrap();
      dispatch(setCredentials(updated));
      localStorage.setItem('userInfo', JSON.stringify(updated));
      navigate('/profile');
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Profile update failed: ' + (err.data?.message || 'Unknown error'));
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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfileMutation, useGetProfileQuery } from '../../redux/api/profile';
import { uploadImage } from '../../redux/api/uploadImage.js';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './editProfile.css';
import ImageInput from '../../components/uploadImageInput.jsx';

const EditProfile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading, isSuccess, isError, error }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
    cloudinaryId: '',
  });
  const [oldCloudinaryId, setOldCloudinaryId] = useState('');
  const [imageSource, setImageSource] = useState(''); // 'upload' or 'url'
  const [previewUrl, setPreviewUrl] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        password: '',
        image: profile.image || '',
        cloudinaryId: profile.cloudinaryId || '',
      });
      setOldCloudinaryId(profile.cloudinaryId || '');
      setPreviewUrl(profile.image);
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
      try {
        setUploadingImage(true);

        const { image, publicId } = await uploadImage(file, oldCloudinaryId); // 🟡 Make sure this returns correct field names

        setFormData((prev) => ({
          ...prev,
          image,
          cloudinaryId: publicId,
        }));

        setOldCloudinaryId(publicId);
        setImageSource('upload'); // Track source
        setPreviewUrl(image);
        setImageSource('upload');
      } catch (err) {
        console.error('Image upload failed:', err); // 🔍 Will show real issue
        alert('Image upload failed. Please try again.');
      } finally {
        setUploadingImage(false); // Stop loader
      }
    } else {
      // URL case
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(file);
      setImageSource('url');
    }
  };

  useEffect(() => {
    console.log('Updated formData:', formData);
  }, [formData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        image: formData.image,
        cloudinaryId: formData.cloudinaryId, // ✅ Send to backend
      };

      if (formData.password) {
        dataToSubmit.password = formData.password;
      }

      const updated = await updateProfile(dataToSubmit).unwrap();

      dispatch(setCredentials(updated));
      localStorage.setItem('userInfo', JSON.stringify(updated));
      navigate('/profile');

      // ✅ Success banner logic here
      if (updated.image !== profile.image) {
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000);
      }

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
            {showBanner && (
              <div className="banner success-banner">
                ✅ Profile image updated successfully!
              </div>
            )}
            <ImageInput
              value={formData.image}
              onChange={handleImageInput}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              uploading={uploadingImage} // ✅ New prop
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

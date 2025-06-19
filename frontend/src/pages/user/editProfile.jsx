import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { update, reset } from '../../redux/features/auth/authSlice';
import './editProfile.css';
import { useNavigate } from 'react-router';
import { Navigate } from 'react-router';

const EditProfile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                password: '',
            });
            navigate('/profile')
        }
        return () => dispatch(reset());
    }, [userInfo, dispatch, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            name: formData.name,
            email: formData.email,
        };
        if (formData.password.trim()) {
            updatedData.password = formData.password;
        }
        dispatch(update(updatedData));
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

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Save Changes'}
                </button>

                {isSuccess && <p className="success-msg">✅ Profile updated successfully!</p>}
                {isError && <p className="error-msg">❌ {message}</p>}
            </form>
        </div>
    );
};

export default EditProfile;

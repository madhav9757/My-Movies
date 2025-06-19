import React, { useState, useEffect } from 'react';
import { useRegisterMutation } from '../../redux/api/users.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [register, { isLoading, isError, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userData = await register(form).unwrap(); // ✅ send to API
      dispatch(setCredentials(userData)); // ✅ update Redux state
      localStorage.setItem('userInfo', JSON.stringify(userData));
      navigate('/profile');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>

        {isError && <p className="error">{error?.data?.message || 'Signup failed'}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

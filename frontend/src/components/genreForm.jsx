import React, { useState } from 'react';
import { useCreateGenreMutation } from '../redux/api/genre.js';
import { useNavigate } from 'react-router-dom';
import './genreForm.css';

const GenreCreate = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [createGenre, { isLoading, error }] = useCreateGenreMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGenre(formData).unwrap();
      navigate('/admin/genres');
    } catch (err) {
      console.error('Genre creation failed', err);
    }
  };

  return (
    <div className="genre-create-container">
      <form className="genre-create-form" onSubmit={handleSubmit}>
        <h2>Create New Genre</h2>

        <input
          type="text"
          name="name"
          placeholder="Genre Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Genre'}
        </button>

        {error && (
          <p className="error-msg">
            {error?.data?.message || 'Failed to create genre'}
          </p>
        )}
      </form>
    </div>
  );
};

export default GenreCreate;
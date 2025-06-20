import React, { useState } from 'react';
import {
  useCreateMovieMutation,
  useUploadMovieImageMutation,
} from '../redux/api/movies.js';
import { useGetGenresQuery } from '../redux/api/genre';
import { useNavigate } from 'react-router-dom';
import './addMovie.css';

const AddMovie = () => {
  const [form, setForm] = useState({
    title: '',
    genre: '',
    description: '',
    releaseDate: '',
    director: '',
    rating: '',
    image: '',
  });

  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  const [createMovie] = useCreateMovieMutation();
  const [uploadImage] = useUploadMovieImageMutation();
  const { data: genres = [] } = useGetGenresQuery();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await uploadImage(formData).unwrap();
        setForm({ ...form, image: res.image });
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMovie({ ...form, rating: Number(form.rating) }).unwrap();
      navigate('/movies');
    } catch (err) {
      console.error('Failed to create movie', err);
    }
  };

  return (
    <div className="add-movie-container">
      <form className="add-movie-form" onSubmit={handleSubmit}>
        <h2>Add New Movie</h2>

        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select name="genre" value={form.genre} onChange={handleChange} required>
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="director"
          placeholder="Director"
          value={form.director}
          onChange={handleChange}
        />

        <input
          type="date"
          name="releaseDate"
          value={form.releaseDate}
          onChange={handleChange}
        />

        <input
          type="number"
          name="rating"
          step="0.1"
          min="0"
          max="10"
          placeholder="Rating (0–10)"
          value={form.rating}
          onChange={handleChange}
        />

        <textarea
          name="description"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Upload Poster</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {preview && <img src={preview} alt="Preview" className="preview-image" />}

        <button type="submit">Create Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;

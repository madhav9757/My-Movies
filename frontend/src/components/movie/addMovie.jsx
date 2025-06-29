import React, { useState } from 'react';
import { FaFilm, FaStar, FaUser, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { MdTitle } from 'react-icons/md';
import {
  useCreateMovieMutation,
} from '../../redux/api/movies.js';
import { useGetGenresQuery } from '../../redux/api/genre.js';
import { useNavigate } from 'react-router-dom';
import ImageInput from '../uploadImageInput.jsx';
import { uploadImage } from '../../redux/api/uploadImage.js';
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
    cloudinaryId: '',
  });

  const [imageSource, setImageSource] = useState('');
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();
  const [createMovie] = useCreateMovieMutation();
  const { data: genres = [] } = useGetGenresQuery();
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (value) => {
    if (value instanceof File) {
      try {

        setUploading(true);
        const { image, publicId } = await uploadImage(value, form.cloudinaryId);

        setForm((prev) => ({ ...prev, image, cloudinaryId: publicId }));
        setPreview(image);
        setImageSource('upload');
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setUploading(false);
      }
    } else {
      // It's a URL
      setForm((prev) => ({ ...prev, image: value }));
      setPreview(value);
      setImageSource('url');
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

        <div className="add-form-grid">

          {/* Title Field */}
          <div className="form-field-group">
            <div className="input-icon-wrapper">
              <MdTitle className="input-icon" />
              <input type="text" name="title" placeholder="Movie Title" value={form.title} onChange={handleChange} required />
            </div>
          </div>

          {/* Director Field */}
          <div className="form-field-group">
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input type="text" name="director" placeholder="Director" value={form.director} onChange={handleChange} />
            </div>
          </div>

          {/* Rating Field */}
          <div className="form-field-group">
            <div className="input-icon-wrapper">
              <FaStar className="input-icon" />
              <input type="number" name="rating" placeholder="Rating (0–10)" value={form.rating} onChange={handleChange} min="0" max="10" step="0.1" />
            </div>
          </div>

          {/* Release Date Field */}
          <div className="form-field-group">
            <div className="input-icon-wrapper">
              <FaCalendarAlt className="input-icon" />
              <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
            </div>
          </div>

          {/* Genre Field */}
          <div className="form-field-group">
            <div className="input-icon-wrapper">
              <FaFilm className="input-icon" />
              <select name="genre" value={form.genre} onChange={handleChange} required>
                <option value="">Select Genre</option>
                {genres.map((g) => (
                  <option key={g._id} value={g._id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description Field (now spans 2 columns on desktop) */}
          <div className="form-field-group span-2-columns"> {/* Added class for spanning */}
            <div className="input-icon-wrapper">
              <FaEdit className="input-icon" />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            </div>
          </div>

          {/* Image Input (now spans 2 columns on desktop) */}
          <div className="form-field-group span-2-columns"> {/* Added class for spanning */}
            <ImageInput
              value={form.image}
              onChange={handleImageChange}
              previewUrl={preview}
              setPreviewUrl={setPreview}
              uploading={uploading}
            />
            <p className="image-note">Note: You can either upload an image or paste an image URL.</p>
          </div>
        </div>

        <button type="submit">🎉 Create Movie</button>
      </form>
    </div>
  );
};

export default AddMovie;

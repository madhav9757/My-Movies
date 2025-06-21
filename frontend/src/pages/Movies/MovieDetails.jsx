import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMoviesQuery, useDeleteMovieMutation } from '../../redux/api/movies.js';
import './movieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movies = [] } = useGetMoviesQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  const navigate = useNavigate();

  const movie = movies.find((m) => m._id === id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
      navigate('/movies');
    }
  };

  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-details-container">
      <img
        src={
          movie.image?.startsWith('https') || movie.image?.startsWith('upload')
            ? movie.image
            : `http://localhost:3000${movie.image}`
        }
        alt={movie.title}
        onError={(e) => (e.target.src = '/placeholder.jpg')}
        className="movie-details-poster"
      />
      <div className="movie-details-content">
        <h2>{movie.title}</h2>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>
        <p><strong>Rating:</strong> ⭐ {movie.rating}</p>
        <p><strong>Description:</strong> {movie.description}</p>
        <p><strong>Genre:</strong> {typeof movie.genre === 'object' ? movie.genre.name : movie.genre}</p>

        <div className="movie-detail-actions">
          <button onClick={() => navigate(`/movies/edit/${movie._id}`)} className="edit-btn">
            ✏ Edit
          </button>
          <button onClick={handleDelete} className="delete-btn">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

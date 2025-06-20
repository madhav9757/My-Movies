import React, { useState } from 'react';
import { useGetMoviesQuery, useDeleteMovieMutation } from '../../redux/api/movies.js';
import { Link } from 'react-router-dom';
import './movies.css';
import placeholder from '../../../../uploads/placeholder.jpg';

const Movies = () => {
  const { data: movies = [], isLoading, error, refetch } = useGetMoviesQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
      refetch();
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h2>🎬 All Movies</h2>
        <div className="movies-actions">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/movies/add" className="add-movie-btn">
            + Add Movie
          </Link>
        </div>
      </div>

      {isLoading ? (
        <p>Loading movies...</p>
      ) : error ? (
        <p>Error loading movies.</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div className="movie-card" key={movie._id}>
                <img
                  src={movie.image || placeholder}
                  alt={movie.title}
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.rating ? `⭐ ${movie.rating}` : 'No rating yet'}</p>
                  <div className="movie-actions">
                    <Link to={`/movies/edit/${movie._id}`} className="edit-btn">
                      ✏ Edit
                    </Link>
                    <button onClick={() => handleDelete(movie._id)} className="delete-btn">
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-movies">🎞️ No movies found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Movies;

import React, { useState } from 'react';
import { useGetMoviesQuery } from '../../redux/api/movies.js';
import { Link, useNavigate } from 'react-router-dom';
import './movies.css';

const Movies = () => {
  const { data: movies = [], isLoading, error } = useGetMoviesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
              <div
                className="movie-card"
                key={movie._id}
                onClick={() => navigate(`/movies/${movie._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className="movie-poster"
                  src={
                    movie.image?.startsWith('https') || movie.image?.startsWith('upload')
                      ? movie.image
                      : `http://localhost:3000${movie.image}`
                  }
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                  alt={movie.title}
                />

                <div className="movie-details">
                  <h3 className="movie-title">{movie.title}</h3>
                  <span className="genre-badge">
                    {typeof movie.genre === 'object' ? movie.genre.name : movie.genre}
                  </span>
                  <div className="rating">
                    <span>⭐</span>
                    <span>{movie.rating || 'N/A'}</span>
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

import React, { useState, useEffect } from 'react';
import { useGetMoviesQuery } from '../../redux/api/movies.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import MovieCard from '../../components/movie/movieCard.jsx';
import './movies.css';

const Movies = () => {
  const { data: movies = [], isLoading, error } = useGetMoviesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'All Movies | MovieApp';
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(debouncedSearch.toLowerCase())
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
        <div className="error-message">
          <p>⚠️ Error loading movies.</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="no-movies">
          <p>🎞️ No movies found.</p>
          <Link to="/movies/add" className="add-movie-btn">
            + Add Your First Movie
          </Link>
        </div>
      )}
    </div>
  );
};

export default Movies;

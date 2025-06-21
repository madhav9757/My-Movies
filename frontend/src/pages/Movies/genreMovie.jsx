import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMoviesQuery } from '../../redux/api/movies';
import { useGetGenresQuery } from '../../redux/api/genre';
import './genreMovie.css';

const GenreMovies = () => {
  const { genreId } = useParams();
  const { data: allMovies = [] } = useGetMoviesQuery();
  const { data: genres = [] } = useGetGenresQuery();

  const [genreDetail, setGenreDetail] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const genre = genres.find((g) => g._id === genreId);
    setGenreDetail(genre);
  }, [genres, genreId]);

  useEffect(() => {
    const genreMovies = allMovies.filter((movie) => {
      if (typeof movie.genre === 'object') return movie.genre._id === genreId;
      return movie.genre === genreId;
    });

    let result = [...genreMovies];

    if (search) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
        result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      default:
        break;
    }

    setFilteredMovies(result);
  }, [allMovies, genreId, search, sortBy]);

  return (
    <div className="genre-movies-page">
      <div className="genre-header">
        <div>
          <h2>🎬 {genreDetail?.name}</h2>
          {genreDetail?.description && <p>{genreDetail.description}</p>}
        </div>
        <div className="search-sort-bar">
          <input
            type="text"
            placeholder="Search in this genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="title">Title (A-Z)</option>
            <option value="date">Newest</option>
          </select>
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <div className="movie-card" key={movie._id}>
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

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Release:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {movie.description}</p>
                <div className="rating">{'⭐'.repeat(Math.round(movie.rating || 0))}</div>
              </div>

              <Link to={`/movies/${movie._id}`} className="details-btn">🔍 View Details</Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">🎞️ No movies found in this genre.</p>
      )}
    </div>
  );
};

export default GenreMovies;

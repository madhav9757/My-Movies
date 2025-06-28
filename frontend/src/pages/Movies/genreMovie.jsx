import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMoviesQuery } from '../../redux/api/movies';
import { useGetGenresQuery } from '../../redux/api/genre';
import MovieCard from '../../components/movie/movieCard';
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
    if (!genreId || !allMovies?.length) return;

    const genreMovies = allMovies.filter((movie) => {
      const movieGenreId =
        typeof movie.genre === 'object' ? movie.genre._id : movie.genre;

      return movieGenreId === genreId;
    });

    let result = [...genreMovies];

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter((movie) =>
        movie.title?.toLowerCase().trim().includes(keyword)
      );
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
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
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="no-movies">🎞️ No movies found in this genre.</p>
      )}
    </div>
  );
};

export default GenreMovies;

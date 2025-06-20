import asyncHandler from '../middlewares/asyncHandler.js';
import Movie from '../models/Movies.js';

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find().populate('genre', 'name slug');
  res.json(movies);
});

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('genre', 'name slug');

  if (movie) {
    res.json(movie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Create new movie
// @route   POST /api/movies
// @access  Admin
const createMovie = asyncHandler(async (req, res) => {
  const { title, genre, description, releaseDate, director, rating, image } = req.body;

  const movie = new Movie({
    title,
    genre,
    description,
    releaseDate,
    director,
    rating,
    image,
  });

  const created = await movie.save();
  res.status(201).json(created);
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Admin
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    const { title, genre, description, releaseDate, director, rating, image } = req.body;

    movie.title = title || movie.title;
    movie.genre = genre || movie.genre;
    movie.description = description || movie.description;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.director = director || movie.director;
    movie.rating = rating ?? movie.rating;
    movie.image = image || movie.image;

    const updated = await movie.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Admin
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    await movie.deleteOne();
    res.json({ message: 'Movie deleted' });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

export {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};

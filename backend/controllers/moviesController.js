import asyncHandler from '../middlewares/asyncHandler.js';
import Movie from '../models/Movies.js';

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find().populate('genre', 'name slug');
  res.status(200).json(movies);
});

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate('genre', 'name slug');
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
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
    cloudinaryId: null,
  });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
});

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const {
    title,
    genre,
    description,
    releaseDate,
    director,
    rating,
    image,
    cloudinaryId,
  } = req.body;

  movie.title = title || movie.title;
  movie.genre = genre || movie.genre;
  movie.description = description || movie.description;
  movie.releaseDate = releaseDate || movie.releaseDate;
  movie.director = director || movie.director;
  movie.rating = rating ?? movie.rating;
  movie.image = image || movie.image;
  movie.cloudinaryId = cloudinaryId || movie.cloudinaryId;

  const updatedMovie = await movie.save();
  res.status(200).json(updatedMovie);
});

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  await movie.deleteOne();
  res.status(200).json({ message: 'Movie deleted successfully' });
});

// @desc    Add a review
// @route   POST /api/movies/:id/reviews
// @access  Private
const movieReviews = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const alreadyReviewed = movie.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this movie');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  movie.reviews.push(review);
  movie.numReviews = movie.reviews.length;
  movie.averageRating =
    movie.reviews.reduce((acc, r) => acc + r.rating, 0) / movie.reviews.length;

  await movie.save();
  res.status(201).json({ message: 'Review added successfully' });
});

// @desc    Delete a review
// @route   DELETE /api/movies/:movieId/reviews/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { movieId, reviewId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const review = movie.reviews.id(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  review.deleteOne();

  movie.numReviews = movie.reviews.length;
  movie.averageRating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((acc, r) => acc + r.rating, 0) / movie.reviews.length
      : 0;

  await movie.save();
  res.status(200).json({ message: 'Review deleted successfully' });
});

export {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  movieReviews,
  deleteReview,
};

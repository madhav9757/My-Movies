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

const movieReviews = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    // prevent duplicate review by same user (optional)
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
    movie.averageRating =
      movie.reviews.reduce((acc, r) => acc + r.rating, 0) / movie.reviews.length;

    await movie.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    throw new Error('Movie not found');
  }
});

// DELETE /api/movies/:movieId/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {
  const { movieId, reviewId } = req.params;
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const review = movie.reviews.id(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Optional: only allow user to delete their own review
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  // ✅ Remove review
  review.deleteOne();

  // ✅ Recalculate ratings
  movie.numReviews = movie.reviews.length;
  movie.averageRating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((acc, r) => acc + r.rating, 0) / movie.reviews.length
      : 0;

  await movie.save();
  res.status(200).json({ message: 'Review deleted' });
});

export {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  movieReviews,
  deleteReview
};

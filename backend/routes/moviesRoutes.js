import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  movieReviews,
  updateReview,
  deleteReview
} from '../controllers/moviesController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js';

const router = express.Router();

// Public
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Restricted (requires authentication)
router.post('/:id/reviews', protect, checkId, movieReviews);
router.delete('/:id/reviews/:reviewId', protect, checkId, deleteReview);
router.put('/:movieId/reviews/:reviewId', protect, updateReview);


// Protected (admin only)
router.post('/', protect, createMovie);
router.put('/:id', protect, updateMovie);
router.delete('/:id', protect, deleteMovie);

export default router;

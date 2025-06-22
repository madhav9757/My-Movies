import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  movieReviews,
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

// Protected (admin only)
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;

import express from 'express';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/moviesController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Protected (admin only)
router.post('/', protect, admin, createMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

export default router;

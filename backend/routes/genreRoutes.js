import express from 'express';
import {
  getGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genreController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getGenres);
router.get('/:id', getGenreById);

// Protected Admin Routes
router.post('/', protect, admin, createGenre);
router.put('/:id', protect, admin, updateGenre);
router.delete('/:id', protect, admin, deleteGenre);

export default router;

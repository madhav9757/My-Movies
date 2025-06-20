import Genre from '../models/Genre.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import slugify from 'slugify';

// @desc    Get all genres
// @route   GET /api/genres
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
    const genres = await Genre.find({});
    res.json(genres);
});

// @desc    Get a genre by ID
// @route   GET /api/genres/:id
// @access  Public
const getGenreById = asyncHandler(async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (genre) {
        res.json(genre);
    } else {
        res.status(404);
        throw new Error('Genre not found');
    }
});

// @desc    Create new genre
// @route   POST /api/genres
// @access  Admin
const createGenre = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const genreExists = await Genre.findOne({ slug });
    if (genreExists) {
        res.status(400);
        throw new Error('Genre already exists');
    }

    const genre = await Genre.create({ name, description, slug });

    if (genre) {
        res.status(201).json(genre);
    } else {
        res.status(400);
        throw new Error('Invalid genre data');
    }
});

// @desc    Update genre
// @route   PUT /api/genres/:id
// @access  Admin
const updateGenre = asyncHandler(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (genre) {
        genre.name = req.body.name || genre.name;
        genre.description = req.body.description || genre.description;
        genre.slug = slugify(genre.name, { lower: true, strict: true });

        const updatedGenre = await genre.save();
        res.json(updatedGenre);
    } else {
        res.status(404);
        throw new Error('Genre not found');
    }
});

// @desc    Delete genre
// @route   DELETE /api/genres/:id
// @access  Admin
const deleteGenre = asyncHandler(async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (genre) {
        await genre.deleteOne();
        res.json({ message: 'Genre removed' });
    } else {
        res.status(404);
        throw new Error('Genre not found');
    }
});

export {
    getGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre,
}
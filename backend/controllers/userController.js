import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/user.js';
import Movie from '../models/Movies.js'
import generateToken from '../utils/createToken.js';

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id, user.isAdmin);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            age: user.age,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: generateToken(null, user._id, user.isAdmin)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin, age } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists with that email');
    }

    const user = await User.create({
        name,
        email,
        password,
        image: req.body.image || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg',
        isAdmin
    });

    if (user) {
        generateToken(res, user._id, user.isAdmin);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            age: user.age,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token: generateToken(null, user._id, user.isAdmin)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    if (req.user) {
        console.log('✅ CONTROLLER: req.user =', req.user?.email);
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
            age: req.user.age,
            image: req.user.image,
            cloudinaryId: req.user.cloudinaryId,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
            token: generateToken(null, req.user._id, req.user.isAdmin),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Handle password change if provided
        if (req.body.password) {
            user.password = req.body.password;
        }

        // --- IMAGE HANDLING LOGIC ---
        if (typeof req.body.image === 'string' && req.body.image !== '') {
            user.image = req.body.image;
        }

        if (typeof req.body.cloudinaryId === 'string' && req.body.cloudinaryId !== '') {
            user.cloudinaryId = req.body.cloudinaryId;
        }

        try {
            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
                cloudinaryId: updatedUser.cloudinaryId,
                isAdmin: updatedUser.isAdmin,
                // Do NOT send password back
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            res.status(400).json({ message: 'Error updating profile', error: error.message });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password'); // Exclude password from results for security
    res.status(200).json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const allMovies = await Movie.find({});
    const userReviews = [];

    allMovies.forEach((movie) => {
        movie.reviews?.forEach((review) => {
            if (review.user && String(review.user) === String(user._id)) {
                userReviews.push({
                    _id: review._id,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt,
                    user: review.user,
                    movie: {
                        _id: movie._id,
                        title: movie.title,
                        image: movie.image,
                    },
                });
            }
        });
    });

    userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        age: user.age,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        reviews: userReviews,
    });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({ _id: user._id }); // Use deleteOne with query object
        res.status(200).json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

        user.age = req.body.age !== undefined ? req.body.age : user.age;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            age: updatedUser.age,
            image: updatedUser.image,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
};
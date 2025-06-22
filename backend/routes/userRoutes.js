import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
} from '../controllers/userController.js'; 
import { protect, admin } from '../middlewares/authMiddleware.js' ;
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.post('/login', authUser);
router.post('/', registerUser); 
router.post('/logout', logoutUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('image'), updateUserProfile);

router.route('/')
    .get(protect, admin, getUsers); 

router.route('/:id')
    .get(protect, admin, getUserById) 
    .delete(protect, admin, deleteUser) 
    .put(protect, admin, updateUser); 

export default router;
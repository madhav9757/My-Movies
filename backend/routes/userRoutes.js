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
import path from 'path'; 

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        
        const userId = req.user ? req.user._id : 'unknown'; 
        cb(
            null,
            `${file.fieldname}-profile-${userId}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

router.post('/login', authUser);
router.post('/', registerUser); 
router.post('/logout', logoutUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('image'), updateUserProfile);

router.route('/')
    .get(protect, admin, getUsers); 

router.route('/:id')
    .get(protect, getUserById) 
    .delete(protect, admin, deleteUser) 
    .put(protect, admin, updateUser); 

export default router;
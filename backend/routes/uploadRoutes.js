import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ✅ Use memory storage for direct Cloudinary streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ @route   POST /api/upload
// ✅ @desc    Upload an image to Cloudinary
// ✅ @access  Private
router.post('/', protect, upload.single('image'), uploadImage);

// ✅ @route   POST /api/upload/delete
// ✅ @desc    Delete an image from Cloudinary
// ✅ @access  Private
router.post('/delete', protect, deleteImage);

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter
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

const upload = multer({ storage, fileFilter });

// Route: POST /api/upload
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  res.status(200).json({ image: `/uploads/${req.file.filename}` });
});

export default router;

import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// ✅ Upload image using buffer stream
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'movie-app',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    res.status(200).json({
      image: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Cloudinary upload failed' });
  }
};

// ✅ Delete image from Cloudinary
const deleteImage = async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ message: 'Missing publicId' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      res.json({ message: 'Image deleted successfully', result });
    } else {
      res.status(400).json({ message: 'Image not deleted', result });
    }
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export { uploadImage, deleteImage };

import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'movie-app', // Optional: Cloudinary folder name
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
        res.status(200).json({
          image: result.secure_url,
          publicId: result.public_id,
        }); // ✅ Return Cloudinary image URL
      }
    );

    // Stream the in-memory buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Something went wrong during upload' });
  }
}

const deleteImage =  async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ message: 'Missing publicId' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(400).json({ message: 'Image not deleted', result });
    }
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export { uploadImage, deleteImage };

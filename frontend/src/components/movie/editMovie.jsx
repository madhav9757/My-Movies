import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMovieByIdQuery, useUpdateMovieMutation } from '../../redux/api/movies.js';
import { useGetGenresQuery } from '../../redux/api/genre.js';
import { uploadImage } from '../../redux/api/uploadImage.js';
import ImageInput from '../uploadImageInput.jsx';
import './editMovie.css';

const EditMovie = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: genres = [] } = useGetGenresQuery();
    const { data: movie, isLoading } = useGetMovieByIdQuery(id);
    const [updateMovie] = useUpdateMovieMutation();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rating: '',
        image: '',
        cloudinaryId: '',
        releaseDate: '',
        genre: '',
    });

    const [preview, setPreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [oldCloudinaryId, setOldCloudinaryId] = useState('');

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || '',
                description: movie.description || '',
                rating: movie.rating || '',
                image: movie.image || '',
                cloudinaryId: movie.cloudinaryId || '',
                releaseDate: movie.releaseDate
                    ? new Date(movie.releaseDate).toISOString().split('T')[0]
                    : '',
                genre: movie.genre ? movie.genre._id : '',
            });

            setPreview(movie.image);
            setOldCloudinaryId(movie.cloudinaryId || '');
        }
    }, [movie, setFormData]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (file) => {
        if (file instanceof File) {

            try {
                setUploadingImage(true); // 🟡 Start loader
                const { image, publicId } = await uploadImage(file, oldCloudinaryId);

                setFormData((prev) => ({
                    ...prev,
                    image: image,
                    cloudinaryId: publicId,
                }));
                setOldCloudinaryId(publicId);
                setPreview(image);
            } catch (err) {
                console.error('Upload failed:', err);
            } finally {
                setUploadingImage(false); // ✅ Stop loader
            }
        } else {
            // It's a URL
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            setPreview(file);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const {
            title,
            description,
            rating,
            image,
            cloudinaryId,
            releaseDate,
            genre,
        } = formData;

        const updatedData = {
            title,
            description,
            rating: Number(rating),
            image,
            cloudinaryId,
            releaseDate,
            genre: typeof genre === 'object' && genre._id ? genre._id : genre,
        };

        try {
            await updateMovie({ id, ...updatedData }).unwrap();
            navigate('/movies');
        } catch (err) {
            console.error('Update failed:', err);
            alert('Failed to update movie. Please try again.');
        }
    };

    if (isLoading) return <p>Loading movie...</p>;

    return (
        <div className="edit-movie-wrapper">
            <div className="edit-movie-container">
                <h2>Edit Movie</h2>
                <form onSubmit={onSubmit} className="movie-form">
                    <div className="edit-form-left">
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title"
                            required
                        />
                        <input
                            type="number"
                            step="0.1"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="Rating"
                            required
                        />
                        <select
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Genre</option>
                            {genres.map((g) => (
                                <option key={g._id} value={g._id}>{g.name}</option>
                            ))}
                        </select>

                        <ImageInput
                            value={formData.image}
                            onChange={handleImageUpload}
                            previewUrl={preview}
                            setPreviewUrl={setPreview}
                            uploading={uploadingImage}
                        />
                        <p className="image-note">Note: You can either upload an image or paste an image URL.</p>
                    </div>

                    <div className="edit-form-right">
                        <input
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Movie Description"
                            rows={10}
                            required
                        />
                        <button type="submit" disabled={isLoading}>✅ Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMovie;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetMovieByIdQuery, useUpdateMovieMutation, useUploadMovieImageMutation } from '../../redux/api/movies.js';
import { useGetGenresQuery } from '../../redux/api/genre.js';
import ImageInput from '../uploadImageInput.jsx';
import './editMovie.css';

const EditMovie = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: genres = [] } = useGetGenresQuery();
    const { data: movie, isLoading } = useGetMovieByIdQuery(id);
    const [updateMovie] = useUpdateMovieMutation();
    const [uploadImage] = useUploadMovieImageMutation();

    const { register, handleSubmit, setValue } = useForm();

    const [imageValue, setImageValue] = useState('');
    const [preview, setPreview] = useState('');
    const [imageSource, setImageSource] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (movie) {
            setValue('title', movie.title);
            setValue('description', movie.description || '');
            setValue('rating', movie.rating);
            setValue('image', movie.image || '');
            setValue('genre', movie.genre?._id || movie.genre || '');

            const fullImageUrl = movie.image?.startsWith('http')
                ? movie.image
                : `${API}${movie.image}`;

            console.log(fullImageUrl);
            setPreview(fullImageUrl);
            setImageValue(movie.image || '');
        }
    }, [movie, setValue]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await uploadImage(formData).unwrap();
            const imageUrl = res.image.startsWith('http') ? res.image : `http://localhost:3000${res.image}`;

            setImageValue(res.image);
            setValue('image', res.image); // for react-hook-form
            setPreview(imageUrl);
            setSelectedFile(file);
            setImageSource('upload');
        } catch (err) {
            console.error('Upload failed', err);
        }
    };

    const onSubmit = async (data) => {
        const formData = {
            ...data,
            image: imageValue,
            genre: typeof data.genre === 'object' && data.genre._id
                ? data.genre._id
                : data.genre,
        };

        try {
            console.log('Final data being sent to updateMovie:', formData);
            await updateMovie({ id, ...formData }).unwrap();
            navigate('/movies');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return <p>Loading movie...</p>;

    return (
        <div className="edit-movie-wrapper">
            <div className="edit-movie-container">
                <h2>Edit Movie</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="movie-form">
                    <div className="edit-form-left">
                        <input {...register('title')} placeholder="Title" required />
                        <input type="number" step="0.1" {...register('rating')} placeholder="Rating" required />
                        <select {...register('genre')} defaultValue={movie?.genre || ''}>
                            <option value="" disabled>Select Genre</option>
                            {genres.map((g) => (
                                <option key={g._id} value={g._id}>{g.name}</option>
                            ))}
                        </select>

                        <ImageInput
                            value={imageValue}
                            onChange={async (val) => {
                                if (typeof val === 'string') {
                                    setImageValue(val);
                                    setValue('image', val);
                                    setSelectedFile(null);
                                    setImageSource('url');
                                    setPreview(val);
                                } else if (val instanceof File) {
                                    await handleImageUpload(val);
                                }
                            }}
                            previewUrl={preview}
                            setPreviewUrl={setPreview}
                        />

                        <p className="image-note">Note: You can either upload an image or paste an image URL.</p>
                    </div>

                    <div className="edit-form-right">
                        <textarea
                            {...register('description')}
                            placeholder="Movie Description"
                            rows={10}
                            required
                        />
                        <button type="submit">✅ Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMovie;

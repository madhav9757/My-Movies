import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetMovieByIdQuery, useUpdateMovieMutation } from '../redux/api/movies.js';
import { useGetGenresQuery } from '../redux/api/genre.js';
import './editMovie.css';

const EditMovie = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: genres = [] } = useGetGenresQuery();
    const { data: movie, isLoading } = useGetMovieByIdQuery(id);
    const [updateMovie] = useUpdateMovieMutation();

    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (movie) {
            setValue('title', movie.title);
            setValue('description', movie.description || '');
            setValue('rating', movie.rating);
            setValue('image', movie.image || '');
            setValue('genre', movie.genre || '');
        }
    }, [movie, setValue]);

    const onSubmit = async (data) => {
        try {
            await updateMovie({ id, ...data }).unwrap();
            navigate('/movies');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return <p>Loading movie...</p>;

    return (
        <div className="edit-movie-container">
            <h2>Edit Movie</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="movie-form">
                <input {...register('title', { required: true })} placeholder="Title" />
                <textarea {...register('description')} placeholder="Description" rows={4} />
                <input type="number" step="0.1" {...register('rating')} placeholder="Rating" />
                <input {...register('image')} placeholder="Image URL or Path" />
                <select {...register('genre')} defaultValue={movie?.genre || ''}>
                    <option value="" disabled>Select a genre</option>
                    {genres.map((genre) => (
                        <option key={genre._id} value={genre._id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
                <button type="submit">✅ Save Changes</button>
            </form>
        </div>
    );
};

export default EditMovie;

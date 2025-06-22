import React from 'react';
import { useNavigate } from 'react-router-dom';
import './movieCard.css';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div
            className="movie-card"
            key={movie._id}
            onClick={() => navigate(`/movies/${movie._id}`)}
            style={{ cursor: 'pointer' }}
        >
            <img
                className="movie-poster"
                src={
                    movie.image?.startsWith('https') || movie.image?.startsWith('upload')
                        ? movie.image
                        : `http://localhost:3000${movie.image}`
                }
                onError={(e) => (e.target.src = '/placeholder.jpg')}
                alt={movie.title}
            />

            <div className="movie-details">
                <h3 className="movie-title">{movie.title}</h3>
                <div className='meta-info'>
                    <span className="genre-badge">
                        {typeof movie.genre === 'object' ? movie.genre.name : movie.genre}
                    </span>
                    <div className="rating">
                        <span>⭐</span>
                        <span>{movie.rating || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MovieCard;


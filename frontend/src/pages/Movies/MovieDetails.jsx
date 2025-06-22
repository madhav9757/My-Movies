import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMoviesQuery, useDeleteMovieMutation, useSubmitReviewMutation } from '../../redux/api/movies.js';
import { useSelector } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';
import './movieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movies = [] } = useGetMoviesQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  const [submitReview] = useSubmitReviewMutation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.userInfo); // ✅ correct|
  console.log("Logged in user:", user);

  const movie = movies.find((m) => m._id === id);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
      navigate('/movies');
    }

  };

  const userReview = movie.reviews.find(r => r.user === user?._id);
  const otherReviews = movie.reviews.filter(r => r.user !== user?._id);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rating') setRating(value);
    else if (name === 'comment') setComment(value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      await submitReview({
        movieId: movie._id,
        reviewData: {
          user: user._id,          // backend expects this?
          name: user.name || "Anonymous",
          rating: Number(rating),
          comment,
        }
      });

      alert('Review submitted successfully!');
      setRating('');
      setComment('');
      navigate(0); // refresh page to reflect new review
    } catch (error) {
      alert('Failed to submit review.');
      console.error(error);
    }
  };

  if (!movie) return <p>Movie not found.</p>;

  return (
    <>
      {/* Main Movie Details Section */}
      <div className="movie-details-container">
        <img
          src={
            movie.image?.startsWith('https') || movie.image?.startsWith('upload')
              ? movie.image
              : `http://localhost:3000${movie.image}`
          }
          alt={movie.title}
          onError={(e) => (e.target.src = '/placeholder.jpg')}
          className="movie-details-poster"
        />

        <div className="movie-details-content">
          <h2>{movie.title}</h2>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>
          <p><strong>Rating:</strong> ⭐ {movie.rating}</p>
          <p><strong>Description:</strong> {movie.description}</p>
          <p><strong>Genre:</strong> {typeof movie.genre === 'object' ? movie.genre.name : movie.genre}</p>

          <div className="movie-detail-actions">
            <button onClick={() => navigate(`/movies/edit/${movie._id}`)} className="edit-btn">
              ✏ Edit
            </button>
            <button onClick={handleDelete} className="delete-btn">
              🗑 Delete
            </button>
          </div>
        </div>
      </div>

      <div className="movie-reviews-section">
        <h3>Reviews</h3>

        {/* Show user's own review if exists */}
        {userReview ? (
          <div className="highlighted-review">
            <p><strong>{userReview.name}:</strong> ⭐ {userReview.rating}</p>
            <p>{userReview.comment}</p>
            <span>{new Date(userReview.createdAt).toLocaleDateString()}</span>
          </div>
        ) : (
          // Inline review input
          <form onSubmit={handleReviewSubmit} className="review-input-inline">
            <select
              className="rating-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">⭐ Rate</option>
              {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>

            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a review..."
              required
            />
            <button type="submit" className="send-btn">➤</button>
          </form>
        )}

        {/* Show other reviews */}
        {otherReviews.length > 0 ? (
          otherReviews.map((review) => (
            <div key={review._id} className="review-card">
              <h4>{review.name}</h4>
              <p>⭐ {review.rating}</p>
              <p>{review.comment}</p>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        ) : !userReview ? (
          <p>No reviews yet.</p>
        ) : null}
      </div>
    </>
  );
};

export default MovieDetails;

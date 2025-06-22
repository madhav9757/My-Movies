import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMoviesQuery, useDeleteMovieMutation, useSubmitReviewMutation, useDeleteReviewMutation } from '../../redux/api/movies.js';
import { useSelector } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';
import './movieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo: user } = useSelector((state) => state.auth);

  const {
    data: movies = [],
    isLoading,
    refetch
  } = useGetMoviesQuery();

  const [deleteMovie] = useDeleteMovieMutation();
  const [submitReview] = useSubmitReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const movie = movies.find((m) => m._id === id);

  if (!movie) return <p>Loading movie...</p>;

  const userReview = movie.reviews.find((r) => r.user === user?._id);
  const otherReviews = movie.reviews.filter((r) => r.user !== user?._id);
  console.log('User Review:', userReview);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
      navigate('/movies');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      await submitReview({
        id: movie._id,
        reviewData: {
          user: user._id,
          name: user.name || 'Anonymous',
          image: user.image,
          rating: Number(rating),
          comment,
        },
      });

      alert('Review submitted!');
      setRating('');
      setComment('');
      await refetch();
    } catch (error) {
      console.error(error);
      alert('Failed to submit review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview({ movieId: movie._id, reviewId });
      alert('Review deleted!');
      refetch(); // to refresh the reviews
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Error deleting review.');
    }
  };

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
            <div className="review-content">
              <div className="review-user">
                {user.image ? (
                  <img src={user.image} alt="avatar" className="avatar" />
                ) : (
                  <span className="user-icon">👤</span>
                )}
                <strong className="user-name">{user.name}</strong>
              </div>
              <span>|</span>
              <span>⭐ {userReview.rating}</span>
              <span>{userReview.comment}</span>
            </div>
            <span className="review-date">
              {new Date(userReview.createdAt).toLocaleDateString()}
            </span>
            <button
              className="delete-review-btn"
              onClick={() => handleDeleteReview(userReview._id)}
            >
              🗑 Delete Review
            </button>
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
            <button type="submit" className="send-btn" disabled={!movie}>➤</button>
          </form>
        )}

        {/* Show other reviews */}
        {otherReviews.length > 0 ? (
          otherReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-content">
                <div className="review-user">
                  {review.image ? (
                    <img src={review.image} alt="avatar" className="avatar" />
                  ) : (
                    <span className="user-icon">👤</span>
                  )}
                  <strong className="user-name">{review.name}</strong>
                </div>
                <span>|</span>
                <span>⭐ {review.rating}</span>
                <span>{review.comment}</span>
              </div>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
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

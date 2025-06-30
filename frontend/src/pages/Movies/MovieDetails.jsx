import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetMovieByIdQuery,
  useDeleteMovieMutation,
  useSubmitReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation
} from '../../redux/api/movies.js';
import { useSelector } from 'react-redux';
import { IoSend } from 'react-icons/io5';
import toast from 'react-hot-toast';
import './movieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo: user } = useSelector((state) => state.auth);

  const { data: movie, isLoading, refetch } = useGetMovieByIdQuery(id);
  const [deleteMovie] = useDeleteMovieMutation();
  const [submitReview] = useSubmitReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState('');
  const [editComment, setEditComment] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (movie?.reviews && user) {
      const existing = movie.reviews.find(
        (r) =>
          (typeof r.user === 'string' && r.user === user._id) ||
          (typeof r.user === 'object' && r.user._id === user._id)
      );
      if (existing) {
        setEditRating(existing.rating);
        setEditComment(existing.comment);
      }
    }
  }, [movie, user]);

  if (isLoading || !movie) return <p>Loading movie...</p>;

  const userReview = movie.reviews.find(
    (r) =>
      (typeof r.user === 'string' && r.user === user?._id) ||
      (typeof r.user === 'object' && r.user._id === user?._id)
  );

  const otherReviews = movie.reviews.filter(
    (r) =>
      !(
        (typeof r.user === 'string' && r.user === user?._id) ||
        (typeof r.user === 'object' && r.user._id === user?._id)
      )
  );

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
      navigate('/movies');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to submit a review.');

    try {
      await submitReview({
        movieId: movie._id,
        reviewData: { rating: Number(rating), comment },
      });
      toast.success('Review submitted!');
      setRating('');
      setComment('');
      refetch();
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error('Failed to submit review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview({ id: movie._id, reviewId });
      toast.success('Review deleted!');
      refetch();
    } catch (err) {
      console.error('Delete review error:', err);
      toast.error('Error deleting review.');
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();

    try {
      await updateReview({
        movieId: movie._id,
        reviewId: userReview._id,
        reviewData: { rating: Number(editRating), comment: editComment },
        token: user.token,
      });
      toast.success('Review updated!');
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error('Update review error:', err);
      toast.error('Failed to update review.');
    }
  };

  return (
    <>
      <div className="movie-details-container">
        <img
          src={movie.image?.startsWith('https') || movie.image?.startsWith('upload') ? movie.image : '/placeholder.jpg'}
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
            <button onClick={() => navigate(`/movies/edit/${movie._id}`)} className="edit-btn">✏ Edit</button>
            <button onClick={handleDelete} className="delete-btn">🗑 Delete</button>
          </div>
        </div>
      </div>

      <div className="movie-reviews-section">
        <h3>Reviews</h3>

        {userReview ? (
          <div className="highlighted-review">
            <div className="review-content">
              <div className="review-user">
                {userReview.user?.image ? (
                  <img src={userReview.user.image} alt="avatar" className="avatar" />
                ) : (
                  <span className="user-icon">👤</span>
                )}
                <strong className="user-name">{userReview.user?.name}</strong>
              </div>
              {isEditing ? (
                <form onSubmit={handleUpdateReview} className="review-edit-form">
                  <select value={editRating} onChange={(e) => setEditRating(e.target.value)} required>
                    <option value="">⭐ Rate</option>
                    {[...Array(11).keys()].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    required
                    rows={1}
                  />
                  <button type="submit" className="send-btn">
                    <IoSend size={18} />
                  </button>
                </form>
              ) : (
                <>
                  <span>|</span>
                  <span>⭐ {userReview.rating}</span>
                  <span>{userReview.comment}</span>
                </>
              )}
            </div>
            <span className="review-date">{new Date(userReview.createdAt).toLocaleDateString()}</span>
            <div className="review-actions">
              <button onClick={() => setIsEditing(!isEditing)} className="edit-review-btn">✏ Edit</button>
              <button onClick={() => handleDeleteReview(userReview._id)} className="delete-review-btn">🗑 Delete</button>
            </div>
          </div>
        ) : (
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
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write a review..."
              rows={1}
              required
              ref={textareaRef}
            />
            <button type="submit" className="send-btn" disabled={!movie}>
              <IoSend size={18} />
            </button>
          </form>
        )}

        {otherReviews.length > 0 ? (
          otherReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-content">
                <div className="review-user">
                  {review.user?.image ? (
                    <img className="avatar" src={review.user.image} alt="avatar" />
                  ) : (
                    <span className="user-icon">👤</span>
                  )}
                  <strong>{review.user?.name}</strong>
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

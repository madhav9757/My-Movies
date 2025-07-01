import React, { useState } from 'react'; // Import useState
import { useParams, Link } from 'react-router-dom';
import { useGetUserProfileQuery } from '../../redux/api/profile.js';
import ImageModal from '../../components/ImageModal.jsx'; // Import ImageModal
import './userProfile.css';

const UserProfile = () => {
  const { userId } = useParams();

  const {
    data: userProfile,
    isLoading,
    isError,
    error
  } = useGetUserProfileQuery(userId);

  // --- NEW STATE FOR IMAGE MODAL ---
  const [modalImageSrc, setModalImageSrc] = useState(null);
  const [modalImageAlt, setModalImageAlt] = useState('');
  // --- END NEW STATE ---

  if (isLoading) {
    return <p className="loading-message">Loading user profile...</p>;
  }

  if (isError) {
    return <p className="error-message">Error loading profile: {error?.data?.message || error?.error || 'An unknown error occurred'}</p>;
  }

  if (!userProfile) {
    return <p className="not-found-message">User not found.</p>;
  }

  // --- NEW HANDLER TO OPEN MODAL ---
  const openImageModal = (src, alt) => {
    setModalImageSrc(src);
    setModalImageAlt(alt);
  };

  const closeImageModal = () => {
    setModalImageSrc(null);
    setModalImageAlt('');
  };
  // --- END NEW HANDLER ---

  return (
    <>
      <div className="user-profile-container">
        <div className="user-profile-header">
          {userProfile.image ? (
            <img
              src={userProfile.image}
              alt={userProfile.name}
              className="profile-avatar"
              onClick={() => openImageModal(userProfile.image, userProfile.name)} // <--- Make avatar clickable
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <span className="profile-user-icon">👤</span>
          )}
          <h2>{userProfile.name}'s Profile</h2>
          <p>Email: {userProfile.email}</p>
        </div>

        <div className="user-reviews-section">
          <h3>Reviews by {userProfile.name} ({userProfile.reviews?.length || 0})</h3>
          {userProfile.reviews && userProfile.reviews.length > 0 ? (
            <div className="user-reviews-list">
              {userProfile.reviews.map((review) => (
                <div key={review._id} className="user-review-card">
                  <div className="user-review-movie-info">
                    <Link to={`/movies/${review.movie._id}`}>
                      <img
                        src={review.movie.image?.startsWith('https') || review.movie.image?.startsWith('upload')
                          ? review.movie.image
                          : `/placeholder.jpg`
                        }
                        alt={review.movie.title}
                        onError={(e) => (e.target.src = '/placeholder.jpg')}
                        className="user-review-movie-poster"
                        onClick={(e) => { // <--- Make review movie poster clickable
                          e.preventDefault();
                          e.stopPropagation();
                          openImageModal(
                            review.movie.image?.startsWith('https') || review.movie.image?.startsWith('upload')
                              ? review.movie.image
                              : `/placeholder.jpg`,
                            review.movie.title
                          );
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <h4 className='user-review-movie-title'>{review.movie.title}</h4>
                    </Link>
                  </div>
                  <div className="user-review-details">
                    <p>Rating: ⭐ {review.rating}</p>
                    <p>{review.comment}</p>
                    <span className="user-review-date">
                      Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>{userProfile.name} hasn't submitted any reviews yet.</p>
          )}
        </div>
      </div>

      {/* --- RENDER THE IMAGE MODAL HERE --- */}
      {modalImageSrc && (
        <ImageModal src={modalImageSrc} alt={modalImageAlt} onClose={closeImageModal} />
      )}
      {/* --- END IMAGE MODAL RENDERING --- */}
    </>
  );
};

export default UserProfile;
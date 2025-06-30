import React from 'react';
import './ImageModal.css';

const ImageModal = ({ src, alt = "Profile Image", onClose }) => {
    if (!src) return null;

    const handleError = (e) => {
        e.target.src = '/default-avatar.png'; // Fallback image if image fails
    };

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                    src={src}
                    alt={alt}
                    className="image-modal-img"
                    onError={handleError}
                />
            </div>
        </div>
    );
};

export default ImageModal;

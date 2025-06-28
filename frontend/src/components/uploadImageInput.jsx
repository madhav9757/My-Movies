import React, { useRef, useState, useEffect } from 'react';
import './uploadImageInput.css';

const ImageInput = ({
  value,
  onChange,
  previewUrl,
  setPreviewUrl,
  name = 'image',
  uploading = false, // ✅ New prop
}) => {
  const fileInputRef = useRef();
  const [imageSource, setImageSource] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(
      imageSource === 'upload' ? `Uploaded: ${selectedFile?.name || ''}` : value
    );
  }, [imageSource, selectedFile, value]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleURLChange = (e) => {
    const url = e.target.value;
    onChange(url);
    setPreviewUrl(url);
    setImageSource('url');
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempURL = URL.createObjectURL(file);
      setPreviewUrl(tempURL);
      setSelectedFile(file);
      onChange(file);
      setImageSource('upload');
    }
  };

  const handleClear = () => {
    onChange('');
    setImageSource('');
    setPreviewUrl('');
    setSelectedFile(null);
  };

  return (
    <div className="image-input-wrapper">
      <div className="image-input-controls">
        <button type="button" className="file-btn" onClick={() => fileInputRef.current.click()}>
          📁
        </button>

        <input
          type="text"
          placeholder="Paste image URL or choose file"
          value={displayValue}
          onChange={handleURLChange}
          disabled={imageSource === 'upload'}
          className="image-url-input"
        />

        {(imageSource === 'upload' || imageSource === 'url') && (
          <button type="button" onClick={handleClear} className="clear-image-button">
            ❌
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="preview-container">
        {uploading ? (
          <div className="preview-loader">
            <div className="spinner" />
            <p>Uploading...</p>
          </div>
        ) : (
          previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />
        )}
      </div>
    </div>
  );
};

export default ImageInput;

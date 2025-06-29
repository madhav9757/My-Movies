import React, { useState, useEffect } from 'react';
import {
  useGetGenresQuery,
  useDeleteGenreMutation,
  useUpdateGenreMutation,
} from '../../redux/api/genre';
import './genreList.css';
import { useNavigate } from 'react-router-dom';


const GenreList = () => {
  const { data: genres, isLoading, error, refetch } = useGetGenresQuery();
  const [deleteGenre] = useDeleteGenreMutation();
  const [updateGenre] = useUpdateGenreMutation();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [updateForm, setUpdateForm] = useState({ name: '', description: '' });

  const navigate = useNavigate();

  const handleGenreClick = (genreId) => {
    navigate(`/genres/${genreId}/movies`);
  };


  const openEditModal = (genre) => {
    setSelectedGenre(genre);
    setUpdateForm({ name: genre.name, description: genre.description });
  };

  const closeModal = () => setSelectedGenre(null);

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGenre({ genreId: selectedGenre._id, ...updateForm }).unwrap();
      closeModal();
      refetch();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this genre?')) {
      await deleteGenre(id);
      refetch();
    }
  };

  useEffect(() => {
    if (error) {
      console.error('Error fetching genres:', error);
    }
    refetch();
  }, [error]);

  return (
    <div className="genre-list-grid-container">
      <div className="genre-list-header">
        <h2>🎬 Genres</h2>
        <button className="add-genre-btn" onClick={() => navigate('/admin/genres/new')}>
          ➕ Add Genre
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading genres.</p>
      ) : (
        <div className="genre-grid">
          {genres.map((genre) => (
            <div className="genre-card"
              onClick={() => handleGenreClick(genre._id)}
              style={{ cursor: 'pointer' }}
              key={genre._id}
            >
              <h3>{genre.name}</h3>
              {genre.description && <p>{genre.description}</p>}
              <div className="genre-card-actions">
                <button onClick={() => openEditModal(genre)} className="edit-btn">
                  ✏️
                </button>
                <button onClick={() => handleDelete(genre._id)} className="delete-btn">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGenre && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Update Genre</h3>
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="name"
                value={updateForm.name}
                onChange={handleUpdateChange}
                required
              />
              <textarea
                name="description"
                value={updateForm.description}
                onChange={handleUpdateChange}
                rows={3}
              />
              <div className="modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreList;

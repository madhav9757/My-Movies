import React from 'react';
import { useGetGenresQuery, useDeleteGenreMutation } from '../../redux/api/genre';
import { Link } from 'react-router-dom';
import './genreList.css';

const GenreList = () => {
  const { data: genres, isLoading, error, refetch } = useGetGenresQuery();
  const [deleteGenre] = useDeleteGenreMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      try {
        await deleteGenre(id);
        refetch(); 
      } catch (err) {
        console.error('Failed to delete genre:', err);
      }
    }
  };

  return (
    <div className="genre-list-container">
      <div className="genre-list-header">
        <h2>🎭 Genre Management</h2>
        <Link to="/admin/genres/new" className="add-genre-btn">➕ Add Genre</Link>
      </div>

      {isLoading ? (
        <p>Loading genres...</p>
      ) : error ? (
        <p className="error">Error fetching genres</p>
      ) : (
        <table className="genre-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {genres?.map((genre) => (
              <tr key={genre._id}>
                <td>{genre.name}</td>
                <td>{genre.slug}</td>
                <td>{genre.description}</td>
                <td>
                  <Link to={`/admin/genres/${genre._id}/edit`} className="edit-btn">✏️ Edit</Link>
                  <button onClick={() => handleDelete(genre._id)} className="delete-btn">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GenreList;

import { apiSlice } from './apiSlice';
import { GENRE_URL } from '../constants';
import { update } from '../features/auth/authSlice';

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create genre
    createGenre: builder.mutation({
      query: (genreData) => ({
        url: GENRE_URL,
        method: 'POST',
        body: genreData,
      }),
    }),
    // Update genre
    updateGenre: builder.mutation({
      query: ({ genreId, ...body }) => ({
        url: `${GENRE_URL}/${genreId}`,
        method: 'PUT',
        body,
      }), 
    }),

    // Delete genre
    deleteGenre: builder.mutation({
      query: (genreId) => ({
        url: `${GENRE_URL}/${genreId}`,
        method: 'DELETE',
      }),
    }),

    // Fetch all genres
    getGenres: builder.query({
      query: () => ({
        url: GENRE_URL,
        method: 'GET',
      }),
      providesTags: ['Genre'],
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useGetGenresQuery,
} = genreApiSlice;

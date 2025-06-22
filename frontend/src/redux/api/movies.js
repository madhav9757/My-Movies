import { apiSlice } from "./apiSlice";
import { MOVIE_URL, UPLOAD_URL } from "../constants";

export const movieApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch all movies
    getMovies: builder.query({
      query: () => ({
        url: MOVIE_URL,
        method: 'GET',
      }),
      providesTags: ['Movie'],
    }),

    // GET: Fetch single movie by ID
    getMovieById: builder.query({
      query: (id) => ({
        url: `${MOVIE_URL}/${id}`,
        method: 'GET',
      }),
    }),

    // POST: Create new movie
    createMovie: builder.mutation({
      query: (movieData) => ({
        url: MOVIE_URL,
        method: 'POST',
        body: movieData,
      }),
      invalidatesTags: ['Movie'],
    }),

    // PUT: Update movie
    updateMovie: builder.mutation({
      query: ({ id, ...movieData }) => ({
        url: `${MOVIE_URL}/${id}`,
        method: 'PUT',
        body: movieData,
      }),
      invalidatesTags: ['Movie'],
    }),

    // DELETE: Remove a movie
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movie'],
    }),

    uploadMovieImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: formData,
        // ⚠️ Let the browser set `Content-Type` for FormData
      }),
    }),

    submitReview: builder.mutation({
      query: ({ id, reviewData }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Movie'],
    }),
  }),
});


export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useSubmitReviewMutation, 
  useUploadMovieImageMutation
} = movieApiSlice;

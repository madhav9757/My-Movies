import { apiSlice } from "./apiSlice";
import { MOVIE_URL } from "../constants";
import api from "./axiosInstance";

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

    submitReview: builder.mutation({
      query: ({ id, reviewData }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Movie'],
    }),

    updateReview: builder.mutation({
      query: ({ movieId, reviewId, reviewData, token }) => ({
        url: `${MOVIE_URL}/${movieId}/reviews/${reviewId}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: ['Movie'],
    }),

    deleteReview: builder.mutation({
      query: ({ id, reviewId }) => ({
        url: `/movies/${id}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
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
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = movieApiSlice;

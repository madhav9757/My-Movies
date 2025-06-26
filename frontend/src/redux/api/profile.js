import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // In apiSlice or injected slice
    getProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useUpdateProfileMutation, useGetProfileQuery } = userApiSlice;

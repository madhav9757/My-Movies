import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateProfile: builder.mutation({
            query: (formData) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: formData,
            }),
        }),

        getProfile: builder.query({
            query: () => ({
                url: `${USERS_URL}/profile`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useUpdateProfileMutation, useGetProfileQuery } = userApiSlice;

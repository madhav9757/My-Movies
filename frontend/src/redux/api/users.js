import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants"; 

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/login`, 
        method: 'POST',
        body: credentials,
        credentials: 'include', // ⬅️ important
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: USERS_URL,
        method: 'POST',
        body: userData,
        credentials: 'include', // ⬅️ important
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`, 
        method: 'POST',
        credentials: 'include', // ⬅️ important
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = userApiSlice;

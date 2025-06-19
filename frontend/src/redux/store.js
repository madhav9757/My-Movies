import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice.js'
import { apiSlice } from './api/apiSlice'; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), 
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice.js';
import { apiSlice } from './api/apiSlice';

// ✅ Load userInfo from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// ✅ Inject into Redux as initial state
const preloadedState = {
  auth: {
    userInfo: userInfoFromStorage,
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState, // ✅ this is what you were missing!
});

export default store;

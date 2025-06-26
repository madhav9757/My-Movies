import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance.js';

// ✅ Robust localStorage parsing
let userInfoFromStorage = null;
try {
  const stored = localStorage.getItem('userInfo');
  userInfoFromStorage =
    stored && stored !== 'undefined' ? JSON.parse(stored) : null;
} catch (error) {
  console.warn('Error parsing userInfo from localStorage:', error);
  userInfoFromStorage = null;
}

// ✅ Initial State
const initialState = {
  userInfo: userInfoFromStorage,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// ✅ LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/api/users/login', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await api.post('/api/users', userData);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Register error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ LOGOUT
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    localStorage.removeItem('userInfo');
    await api.post('/api/users/logout');
    return;
  } catch (error) {
    const message =
      error?.response?.data?.message || error.message || 'Logout error';
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manually update credentials
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userInfo = null;
      })
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userInfo = null;
      })
      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      });
  },
});

// ✅ Exports
export const { setCredentials, reset } = authSlice.actions;
export default authSlice.reducer;

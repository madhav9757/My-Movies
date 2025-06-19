import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Login failed');
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Login error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const update = createAsyncThunk(
  'auth/update',
  async (userData, thunkAPI) => {
    try {
      // Get token from state
      const state = thunkAPI.getState();
      const token = state.auth.user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Update failed');
      }

      // Update localStorage and return updated user
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Update error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Registration failed');
      }

      localStorage.setItem('userInfo', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Register error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ✅ LOGOUT
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    localStorage.removeItem('userInfo');
    await fetch('/api/users/logout', { method: 'POST' });
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
    // Set user manually (optional for RTK Query)
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
      .addCase(update.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
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

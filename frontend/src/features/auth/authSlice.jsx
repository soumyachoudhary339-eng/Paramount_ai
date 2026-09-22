import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUserApi, loginUserApi, logoutUserApi} from '../../api/authService'; // logoutUserApi function import karein
// 1. Login Async Thunk (Creates HTTP-only Cookie & Returns Data)
export const loginAuth = createAsyncThunk(
  'auth/loginAuth',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Invalid credentials or login failed'
      );
    }
  }
);
// 2. App reload hone par backend cookie check karne wala thunk
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUserApi();
      return data; // Backend response: { success: true, user: {...}, careerGoal: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Session expired or invalid token'
      );
    }
  }
);

// 3. Logout karne wala async thunk
export const logoutAuth = createAsyncThunk(
  'auth/logoutAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutUserApi();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to logout from server'
      );
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  careerGoal: null,
  loading: true, // Page reload guard ke liye default true
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerFullAccount: (state, action) => {
      const { user, careerGoal } = action.payload;
      state.user = user;
      state.careerGoal = careerGoal;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.careerGoal = action.payload.careerGoal || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // Synchronous reset fallback
    logoutUser: (state) => {
      state.user = null;
      state.careerGoal = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
    .addCase(loginAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAuth.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.careerGoal = action.payload?.careerGoal || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginAuth.rejected, (state, action) => {
        state.user = null;
        state.careerGoal = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // --- CHECK AUTH HANDLERS ---
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.careerGoal = action.payload?.careerGoal || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.careerGoal = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // --- LOGOUT AUTH HANDLERS ---
      .addCase(logoutAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAuth.fulfilled, (state) => {
        state.user = null;
        state.careerGoal = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutAuth.rejected, (state) => {
        // Server pe failure aane ya token expire hone par bhi UI se token/user clear hona zaroori hai
        state.user = null;
        state.careerGoal = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { registerFullAccount, loginUser, logoutUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUserApi } from '../../api/authService'; // Apne authApi ka relative path dein

// App reload hone par backend cookie check karne wala thunk
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

const initialState = {
  user: null,
  isAuthenticated: false,
  careerGoal: null,
  loading: true, // Page reload guard ke liye default true rakhna mandatory hai
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
      // 1. Pending Status
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 2. Cookie Valid & Verified
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.careerGoal = action.payload?.careerGoal || null;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      // 3. Cookie Expired / Absent
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.careerGoal = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { registerFullAccount, loginUser, logoutUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
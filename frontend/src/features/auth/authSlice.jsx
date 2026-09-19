import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  careerGoal: null,
  loading: true, // Initial check ke liye true
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
      state.user =  action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = false;
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
});

export const { registerFullAccount, loginUser, logoutUser, setLoading } = authSlice.actions;

// 👇 Yeh default export hona bahut zaroori hai store.jsx ke liye
export default authSlice.reducer;
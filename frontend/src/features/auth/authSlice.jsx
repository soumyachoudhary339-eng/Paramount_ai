import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  careerGoal: null,
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
    },
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.careerGoal = null;
    },
  },
});

export const { registerFullAccount, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
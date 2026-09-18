// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   careerGoal: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     registerFullAccount: (state, action) => {
//       const { user, careerGoal } = action.payload;
//       state.user = user;
//       state.careerGoal = careerGoal;
//       state.isAuthenticated = true;
//     },
//     loginUser: (state, action) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.careerGoal = null;
//     },
//   },
// });

// export const { registerFullAccount, loginUser, logoutUser } = authSlice.actions;
// export default authSlice.reducer;

// 
import { createSlice } from '@reduxjs/toolkit';

// Default initial state (mock authenticated user for instant UI testing)
const initialState = {
  user: {
    id: 'user_123',
    name: 'Rahul Sharma',
    email: 'student@college.edu',
    hasCompletedOnboarding: true,
  },
  careerGoal: {
    degree: 'B.Tech CSE / IT',
    targetRole: 'Full-Stack Developer',
    targetIndustry: 'Software & IT',
    skills: ['JavaScript', 'React', 'HTML/CSS'],
    suggestedCourses: ['Full-Stack MERN', 'DSA in Java'],
  },
  isAuthenticated: true,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 1. Complete Registration Reducer
    registerFullAccount: (state, action) => {
      const { user, careerGoal } = action.payload;
      state.user = {
        ...user,
        id: `user_${Date.now()}`,
        hasCompletedOnboarding: true,
      };
      state.careerGoal = careerGoal;
      state.isAuthenticated = true;
      state.error = null;
    },

    // 2. Mock Login Reducer
    loginUser: (state, action) => {
      const { email } = action.payload;
      state.user = {
        id: 'user_123',
        name: email.split('@')[0] || 'Student',
        email: email,
        hasCompletedOnboarding: true,
      };
      state.isAuthenticated = true;
      state.error = null;
    },

    // 3. Logout Reducer
    logoutUser: (state) => {
      state.user = null;
      state.careerGoal = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { registerFullAccount, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
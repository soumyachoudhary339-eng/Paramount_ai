import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// import resumeReducer from '../features/resume/resumeSlice';
// import roadmapReducer from '../features/roadmap/roadmapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // resume: resumeReducer,
    // roadmap: roadmapReducer,
  },
});
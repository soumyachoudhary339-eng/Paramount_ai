import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import resumeReducer from '../features/resume/resumeSlice';
import roadmapReducer from '../features/roadmap/roadmapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    resume: resumeReducer,
    roadmap: roadmapReducer,
  },
});
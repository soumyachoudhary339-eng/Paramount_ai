import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
// import { DashboardPage } from '../features/dashboard/DashboardPage';
// import { ResumeAnalyzerPage } from '../features/resume/ResumeAnalyzerPage';
// import { ResumeMakerPage } from '../features/resume/ResumeMakerPage';
// import { RoadmapPage } from '../features/roadmap/RoadmapPage';
// import { DashboardLayout } from '../components/layout/DashboardLayout';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Dashboard Routes */}
        <Route
        //   element={
        //     <ProtectedRoute>
        //       <DashboardLayout />
        //     </ProtectedRoute>
        //   }
        >
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          {/* <Route path="/roadmap" element={<RoadmapPage />} /> */}
          {/* <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} /> */}
          {/* <Route path="/resume-maker" element={<ResumeMakerPage />} /> */}
        </Route>

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
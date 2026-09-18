import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ✅ Fix: Changed from named imports { Page } to default imports Page
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ResumeAnalyzerPage from '../features/resume/ResumeAnalyzerPage';
import ResumeMakerPage from '../features/resume/ResumeMakerPage';
import DashboardLayout from '../components/layout/DeshboardLayout';
import RoadmapPage from '../features/roadmap/RoadmapPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const LayoutWrapper = () => {
  const { user, careerGoal } = useAuth();
  return (
    <DashboardLayout user={user} careerGoal={careerGoal}>
      <Outlet />
    </DashboardLayout>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Nested Routes */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
          <Route path="/resume-maker" element={<ResumeMakerPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
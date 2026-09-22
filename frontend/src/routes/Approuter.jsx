import  { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../features/auth/authSlice'; // Path confirm kar lein

import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ResumeAnalyzerPage from '../features/resume/ResumeAnalyzerPage';
import ResumeMakerPage from '../features/resume/ResumeMakerPage';
import DashboardLayout from '../components/layout/DeshboardLayout';
import RoadmapPage from '../features/roadmap/RoadmapPage';

// 🔴 Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Verification hone tak Redirect mat karo, Spinner dikhao
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-gray-500">Verifying Session...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const LayoutWrapper = () => {
  const { user, careerGoal } = useSelector((state) => state.auth);
  return (
    <DashboardLayout user={user} careerGoal={careerGoal}>
      <Outlet />
    </DashboardLayout>
  );
};

export const AppRouter = () => {
  const dispatch = useDispatch();

  // 🔴 App Reload hote hi Cookie Check Dispatch hoga
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {
  // Redux store se values fetch karein
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. App Reload / Cookie Verify hone tak Spinner ruka rahega
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // 2. Cookie invalid milne par redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Onboarding Guard
  if (!user.hasCompletedOnboarding && location.pathname !== '/register') {
    return <Navigate to="/register" replace />;
  }

  return children;
};
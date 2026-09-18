import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Loading State Check (Jab tak Auth state verify ho raha hai)
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

  // 2. Unauthenticated Check (Agar logged in nahi hai toh /login par redirect)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Profile Onboarding Check (Degree & Goal fill nahi kiya toh registration/onboarding step par wapas bhejo)
  if (!user.hasCompletedOnboarding && location.pathname !== '/register') {
    return <Navigate to="/register" replace />;
  }

  // Session verified & authorized -> Render protected component
  return children;
};
import { useSelector, useDispatch } from 'react-redux';
import { 
  registerFullAccount, 
  loginUser, 
  logoutUser 
} from '../features/auth/authSlice';
import { loginUserApi } from '../api/authService'; // Path confirm kar lein

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // 🔴 1. Redux store se 'loading' state destructure karein
  const { user, isAuthenticated, careerGoal, loading } = useSelector((state) => state.auth);

  const completeRegistration = (userData, goalData) => {
    dispatch(registerFullAccount({ user: userData, careerGoal: goalData }));
  };

  // 🔴 2. Async Login Handler - Backend API call + Redux Dispatch
  const handleLogin = async (credentials) => {
    try {
      const data = await loginUserApi(credentials); // Backend par /auth/login request
      if (data.success) {
        // Redux store me user aur goal save karein
        dispatch(loginUser({ user: data.user, careerGoal: data.careerGoal || null }));
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    careerGoal,
    loading, // 👈 Main Fix: Reload guard ke liye 'loading' pass kar rahe hain
    completeRegistration,
    handleLogin,
    logout,
  };
};
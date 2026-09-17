import { useSelector, useDispatch } from 'react-redux';
import { registerFullAccount, loginUser, logoutUser } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, careerGoal } = useSelector((state) => state.auth);

  const completeRegistration = (userData, goalData) => {
    dispatch(registerFullAccount({ user: userData, careerGoal: goalData }));
  };

  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    careerGoal,
    completeRegistration,
    handleLogin,
    logout,
  };
};
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppRouter } from './routes/Approuter.jsx';
import { getCurrentUserApi } from './api/authService'; // 👈 Service se import kiya
import { loginUser, logoutUser } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const data = await getCurrentUserApi(); // 👈 Service function call kiya
        if (data && data.user) {
          dispatch(loginUser(data.user));
        }
      } catch (error) {
        console.log("Session expired or not logged in");
        dispatch(logoutUser());
      }
    };

    verifySession();
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
import  { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppRouter } from './routes/Approuter.jsx';
import { checkAuth, } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Reload hote hi backend cookie verify hoga
    dispatch(checkAuth());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
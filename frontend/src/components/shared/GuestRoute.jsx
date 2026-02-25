import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (user) {
    const target = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  return children;
}

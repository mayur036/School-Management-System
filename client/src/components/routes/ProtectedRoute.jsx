import { Navigate, Outlet } from 'react-router-dom';

import FullScreenLoader from '@/helper/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <FullScreenLoader message="Loading your workspace..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

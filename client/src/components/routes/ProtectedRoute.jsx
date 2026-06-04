import { Navigate, Outlet } from 'react-router-dom';

import { useGetMeQuery } from '@/features/auth/auth.api';
import FullScreenLoader from '@/helper/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth';

/**
 * Gate for authenticated-only routes. The app shell waits for the first
 * /auth/me to resolve before rendering routes, so by this point
 * isAuthLoading is false; the check is kept as a safety net.
 */
const ProtectedRoute = () => {
  useGetMeQuery();
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <FullScreenLoader message="Loading your workspace..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

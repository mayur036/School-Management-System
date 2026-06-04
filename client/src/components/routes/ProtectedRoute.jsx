import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

/**
 * Gate for authenticated-only routes. The app shell waits for the first
 * /auth/me to resolve before rendering routes, so by this point
 * isAuthLoading is false; the check is kept as a safety net.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

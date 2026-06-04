import { Navigate, Outlet } from 'react-router-dom';

import FullScreenLoader from '@/helper/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth';

/** Gate for guest-only routes (e.g. login). Authenticated users are bounced. */
const GuestRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <FullScreenLoader message="Checking session..." />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;

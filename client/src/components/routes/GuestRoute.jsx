import { Navigate, Outlet } from 'react-router-dom';

import FullScreenLoader from '@/helper/FullScreenLoader';
import { useAuth } from '@/hooks/useAuth';
import { roleHome } from '@/lib/roles';

/** Gate for guest-only routes (e.g. login). Authenticated users are bounced
 * to their own role's home. */
const GuestRoute = () => {
  const { isAuthenticated, isAuthLoading, role } = useAuth();

  if (isAuthLoading) {
    return <FullScreenLoader message="Checking session..." />;
  }

  return isAuthenticated ? (
    <Navigate to={roleHome(role)} replace />
  ) : (
    <Outlet />
  );
};

export default GuestRoute;

import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

/** Gate for guest-only routes (e.g. login). Authenticated users are bounced. */
const GuestRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default GuestRoute;

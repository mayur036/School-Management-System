import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { roleHome } from '@/lib/roles';

/**
 * Role gate for routes nested under ProtectedRoute (so the user is already
 * authenticated here). If their role isn't allowed for this branch, bounce
 * them to their own home instead of showing a forbidden page.
 *
 * @param {{ allow: string[] }} props - roles permitted on this branch
 */
const RoleRoute = ({ allow }) => {
  const { role } = useAuth();

  if (!allow.includes(role)) {
    return <Navigate to={roleHome(role)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

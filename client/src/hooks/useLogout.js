import { useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '@/features/auth/auth.api';

/**
 * Shared logout action for the role headers. Clears server + local auth
 * state (handled in the mutation's onQueryStarted) then routes to /login.
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return { handleLogout, isLoggingOut: isLoading };
};

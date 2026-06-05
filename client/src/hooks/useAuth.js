import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, isAuthLoading } = useSelector(
    (state) => state.auth
  );
  return {
    user,
    isAuthenticated,
    isAuthLoading,
    role: user?.role_name,
  };
};

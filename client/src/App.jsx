import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import GuestRoute from '@/components/routes/GuestRoute';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import { useGetMeQuery } from '@/features/auth/auth.api';
import { useAuth } from '@/hooks/useAuth';

import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <span className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
  </div>
);

const AppRoutes = () => {
  // Hydrate auth state once. The cookie (if any) authenticates this call.
  useGetMeQuery();
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) return <FullScreenLoader />;

  return (
    <Routes>
      {/* Guest-only */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated-only */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;

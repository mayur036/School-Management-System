import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from '@/components/routes/ProtectedRoute';
import FullScreenLoader from '@/helper/FullScreenLoader';

import SuperAdminLayout from './components/layouts/super_admin';
import GuestRoute from './components/routes/GuestRoute';

//pages
const Home = lazy(() => import('./features/guest/pages/Home'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const ProfilePage = lazy(
  () => import('./features/super_admin/pages/ProfilePage')
);
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const SuperAdminDashboard = lazy(
  () => import('./features/super_admin/pages/SuperAdminDashboard')
);

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <SuperAdminLayout />,
        children: [
          { path: '/dashboard', element: <SuperAdminDashboard /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  // ── Fallback
  { path: '*', element: <ErrorPage /> },
]);

const App = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;

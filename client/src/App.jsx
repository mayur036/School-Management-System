import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import ProtectedRoute from '@/components/routes/ProtectedRoute';
import RoleRoute from '@/components/routes/RoleRoute';
import FullScreenLoader from '@/helper/FullScreenLoader';
import { ROLES } from '@/lib/roles';

import SchoolAdminLayout from './components/layouts/school_admin';
import StaffLayout from './components/layouts/staff';
import SuperAdminLayout from './components/layouts/super_admin';
import GuestRoute from './components/routes/GuestRoute';

//pages
const Home = lazy(() => import('./features/guest/pages/Home'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const ProfileView = lazy(() => import('./features/profile/ProfileView'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const SuperAdminDashboard = lazy(
  () => import('./features/super_admin/pages/SuperAdminDashboard')
);
const SchoolAdminDashboard = lazy(
  () => import('./features/school_admin/pages/SchoolAdminDashboard')
);
const StaffDashboard = lazy(
  () => import('./features/staff/pages/StaffDashboard')
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
      // ── Super Admin (/super/*)
      {
        path: 'super',
        element: <RoleRoute allow={[ROLES.SUPER_ADMIN]} />,
        children: [
          {
            element: <SuperAdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <SuperAdminDashboard /> },
              { path: 'profile', element: <ProfileView /> },
            ],
          },
        ],
      },

      // ── School Admin (/school/*)
      {
        path: 'school',
        element: <RoleRoute allow={[ROLES.SCHOOL_ADMIN]} />,
        children: [
          {
            element: <SchoolAdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <SchoolAdminDashboard /> },
              { path: 'profile', element: <ProfileView /> },
            ],
          },
        ],
      },

      // ── Staff (/staff/*)
      {
        path: 'staff',
        element: <RoleRoute allow={[ROLES.STAFF]} />,
        children: [
          {
            element: <StaffLayout />,
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              { path: 'dashboard', element: <StaffDashboard /> },
              { path: 'profile', element: <ProfileView /> },
            ],
          },
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

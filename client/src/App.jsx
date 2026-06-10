import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import ProtectedRoute from '@/components/routes/ProtectedRoute';
import RoleRoute from '@/components/routes/RoleRoute';
import FullScreenLoader from '@/helper/FullScreenLoader';
import { ROLES } from '@/lib/roles';

import SchoolAdminLayout from './components/layouts/school_admin';
import StaffLayout from './components/layouts/staff';
import SuperAdminLayout from './components/layouts/super_admin';
import GuestRoute from './components/routes/GuestRoute';

// Pages
const Home = lazy(() => import('./features/guest/pages/Home'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(
  () => import('./features/auth/pages/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(
  () => import('./features/auth/pages/ResetPasswordPage')
);
const ProfileView = lazy(() => import('./features/profile/pages/ProfileView'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Super Admin
const SuperAdminDashboard = lazy(
  () => import('./features/super_admin/pages/SuperAdminDashboard')
);
const SchoolsPage = lazy(
  () => import('./features/super_admin/pages/SchoolsPage')
);
const AdminsPage = lazy(
  () => import('./features/super_admin/pages/AdminsPage')
);

// School Admin
const SchoolAdminDashboard = lazy(
  () => import('./features/school_admin/pages/SchoolAdminDashboard')
);
const DepartmentsPage = lazy(
  () => import('./features/school_admin/pages/DepartmentsPage')
);
const StaffPage = lazy(() => import('./features/school_admin/pages/StaffPage'));
const RegisterStaffPage = lazy(
  () => import('./features/school_admin/pages/RegisterStaffPage')
);

// Staff
const StaffDashboard = lazy(
  () => import('./features/staff/pages/StaffDashboard')
);

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
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
              { path: 'schools', element: <SchoolsPage /> },
              { path: 'admins', element: <AdminsPage /> },
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
              { path: 'departments', element: <DepartmentsPage /> },
              { path: 'staff', element: <StaffPage /> },
              { path: 'staff/register', element: <RegisterStaffPage /> },
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

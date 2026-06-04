import { Outlet } from 'react-router-dom';

import { useGetMeQuery } from '@/features/auth/auth.api';

const SuperAdminLayout = () => {
  useGetMeQuery();
  return (
    <div>
      SuperAdminLayout
      <Outlet />
    </div>
  );
};

export default SuperAdminLayout;

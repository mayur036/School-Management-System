import { Outlet } from 'react-router-dom';

import SchoolAdminHeader from './Header';
import SchoolAdminSidebar from './Sidebar';

const SchoolAdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SchoolAdminSidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <SchoolAdminHeader />
        <main className="bg-muted/20 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SchoolAdminLayout;

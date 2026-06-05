import { Outlet } from 'react-router-dom';

import StaffHeader from './Header';
import StaffSidebar from './Sidebar';

const StaffLayout = () => {
  return (
    <div className="flex min-h-screen">
      <StaffSidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <StaffHeader />
        <main className="bg-muted/20 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;

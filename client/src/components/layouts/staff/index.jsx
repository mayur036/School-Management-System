import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import StaffHeader from './Header';
import StaffSidebar from './Sidebar';

const StaffLayout = () => {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset className="flex min-w-0 flex-col">
        <StaffHeader />
        <main className="bg-muted/10 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StaffLayout;

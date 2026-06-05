import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import SuperAdminHeader from './Header';
import SuperAdminSidebar from './Sidebar';

const SuperAdminLayout = () => {
  return (
    <SidebarProvider>
      <SuperAdminSidebar />
      <SidebarInset className="flex min-w-0 flex-col">
        <SuperAdminHeader />
        <main className="bg-muted/10 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SuperAdminLayout;

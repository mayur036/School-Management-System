import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import SchoolAdminHeader from './Header';
import SchoolAdminSidebar from './Sidebar';

const SchoolAdminLayout = () => {
  return (
    <SidebarProvider>
      <SchoolAdminSidebar />
      <SidebarInset className="flex min-w-0 flex-col">
        <SchoolAdminHeader />
        <main className="bg-muted/10 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SchoolAdminLayout;

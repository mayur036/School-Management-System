import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const RoleLayoutContent = ({ config }) => {
  const {
    brand,
    rootLabel,
    groups,
    home,
    profilePath,
    LogoutIcon,
    fallbackInitials,
    pageLabels,
  } = config;

  return (
    <>
      <AppSidebar
        brand={brand}
        groups={groups}
        home={home}
        profilePath={profilePath}
        fallbackInitials={fallbackInitials}
      />
      <SidebarInset className="flex min-w-0 flex-col">
        <AppHeader
          rootLabel={rootLabel}
          profilePath={profilePath}
          pageLabels={pageLabels}
          LogoutIcon={LogoutIcon}
          fallbackInitials={fallbackInitials}
        />
        <main className="bg-muted flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
};

const RoleLayout = ({ config }) => {
  const { groups, pageLabels: overrides } = config;

  const pageLabels = {
    ...Object.fromEntries(
      groups.flatMap((group) =>
        group.items.map((item) => [item.to, item.label])
      )
    ),
    ...overrides,
  };

  const layoutConfig = {
    ...config,
    pageLabels,
  };

  return (
    <SidebarProvider>
      <RoleLayoutContent config={layoutConfig} />
    </SidebarProvider>
  );
};

export default RoleLayout;

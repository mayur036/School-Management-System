import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

/**
 * Generic role layout: persistent sidebar + sticky header + content outlet.
 * Every per-role layout is just a `config` passed to this component, so the
 * three roles stay visually identical and only differ in nav + branding.
 *
 * Breadcrumb page labels are derived from the nav config (pathname → label),
 * with an optional `pageLabels` override for routes not present in the nav.
 */
const RoleLayout = ({ config }) => {
  const {
    brand,
    rootLabel,
    groups,
    home,
    profilePath,
    LogoutIcon,
    fallbackInitials,
    pageLabels: overrides,
  } = config;

  const pageLabels = {
    ...Object.fromEntries(
      groups.flatMap((group) =>
        group.items.map((item) => [item.to, item.label])
      )
    ),
    ...overrides,
  };

  return (
    <SidebarProvider>
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
          home={home}
          profilePath={profilePath}
          pageLabels={pageLabels}
          LogoutIcon={LogoutIcon}
          fallbackInitials={fallbackInitials}
        />
        <main className="bg-muted/10 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RoleLayout;

import { Link, NavLink } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import ThemeToggler from '@/helper/ThemeToggler';
import { GUEST } from '@/lib/icons';
import { cn } from '@/lib/utils';

import { PUBLIC_NAV_LINKS } from './nav.config';

const linkClasses = ({ isActive }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
  );

const Brand = () => (
  <Link to="/" className="flex items-center gap-2">
    <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
      <GUEST.LOGO className="size-5" />
    </span>
    <span className="flex flex-col leading-none">
      <span className="text-foreground text-base font-bold tracking-tight">
        CampusCore
      </span>
      <span className="text-muted-foreground mt-0.5 text-[11px]">
        School Management
      </span>
    </span>
  </Link>
);

/** Trigger button that lives in the header and opens the mobile sidebar. */
const MobileMenuTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      aria-label="Open menu"
      onClick={toggleSidebar}
    >
      <GUEST.MENU className="size-5" />
    </Button>
  );
};

/** Contents of the mobile shadcn Sidebar (rendered as a Sheet on mobile). */
const MobileMenuContent = () => {
  const { setOpenMobile } = useSidebar();
  const close = () => setOpenMobile(false);

  return (
    <Sidebar side="right" className="border-l">
      <SidebarHeader className="p-4">
        <Brand />
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {PUBLIC_NAV_LINKS.map((link) => (
            <SidebarMenuItem key={link.to}>
              <SidebarMenuButton asChild size="lg">
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      'font-medium',
                      isActive &&
                        'bg-sidebar-accent text-sidebar-accent-foreground'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button asChild className="w-full">
          <Link to="/login" onClick={close}>
            Sign In
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export const PublicNavbar = () => {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-30 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggler />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Sign In</Link>
          </Button>

          {/* Mobile menu — shadcn Sidebar (opens as a drawer on mobile only) */}
          <SidebarProvider
            defaultOpen={false}
            className="min-h-0 w-auto md:hidden"
          >
            <MobileMenuTrigger />
            <MobileMenuContent />
          </SidebarProvider>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;

import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { BASE } from '@/lib/icons';

const PAGE_INFOS = {
  '/school/dashboard': {
    title: 'Dashboard',
    description: 'Overview of campus statistics and quick metrics.',
  },
  '/super/dashboard': {
    title: 'Dashboard',
    description: 'System-wide metrics and multi-tenant statistics.',
  },
  '/school/departments': {
    title: 'Departments',
    description: 'Manage school administrative and academic departments.',
  },
  '/school/staff': {
    title: 'Staff Directory',
    description: 'View, filter, and manage department staff records.',
  },
  '/school/staff/register': {
    title: 'Register Staff',
    description: 'Onboard a new staff member and configure credentials.',
  },
  '/super/schools': {
    title: 'Schools',
    description: 'Onboard and manage registered school campuses.',
  },
  '/super/profile': {
    title: 'Profile Settings',
    description: 'Manage your administrative account settings.',
  },
  '/school/profile': {
    title: 'Profile Settings',
    description: 'Manage your administrator account settings.',
  },
};

const AppHeader = ({
  rootLabel,
  profilePath,
  pageLabels,
  LogoutIcon,
  fallbackInitials = 'U',
}) => {
  const { user } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const { pathname } = useLocation();
  const { toggleSidebar } = useSidebar();

  const getPageInfo = () => {
    if (PAGE_INFOS[pathname]) return PAGE_INFOS[pathname];

    const matchingKey = Object.keys(PAGE_INFOS)
      .sort((a, b) => b.length - a.length)
      .find((key) => pathname.startsWith(key));

    if (matchingKey) return PAGE_INFOS[matchingKey];

    return {
      title: pageLabels[pathname] ?? rootLabel,
      description: `Manage your ${rootLabel?.toLowerCase() || 'campus'} account and operations.`,
    };
  };

  const pageInfo = getPageInfo();

  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    fallbackInitials;

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 border-border/60 sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md transition-colors duration-300 md:px-6">
      {/* Left side: Mobile menu toggle + logo / Desktop breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle & Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:bg-muted/40 hover:text-foreground -ml-2 h-9 w-9 cursor-pointer rounded-lg"
            aria-label="Toggle Menu"
          >
            <BASE.MENU className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <BASE.GRADUATION_CAP className="size-5" />
            </div>
            <span className="text-foreground text-base font-bold tracking-tight">
              CampusCore
            </span>
          </div>
        </div>

        {/* Desktop Page Title & Description */}
        <div className="hidden flex-col leading-tight select-none md:flex">
          <span className="text-foreground text-base font-bold">
            {pageInfo.title}
          </span>
          <span className="text-muted-foreground mt-0.5 text-[11px]">
            {pageInfo.description}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User Profile */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="Open account menu"
                className="group hover:bg-muted/40 h-auto cursor-pointer gap-2.5 rounded-full p-1.5 transition-all duration-200"
              >
                <div className="relative">
                  <Avatar className="size-8 border transition-transform duration-200 group-hover:scale-105">
                    <AvatarImage
                      src={user.avatar_url || undefined}
                      alt={`${user.first_name} ${user.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ring-background absolute right-0 bottom-0 block size-2.5 rounded-full bg-green-500 ring-2" />
                </div>
                <div className="hidden flex-col items-start text-left leading-none sm:flex">
                  <span className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-muted-foreground mt-1 text-[10px] capitalize">
                    {user.role_name?.replace('_', ' ')}
                  </span>
                </div>
                <BASE.CHEVRON_DOWN className="text-muted-foreground/60 hidden size-3.5 transition-transform duration-200 group-hover:translate-y-0.5 sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-foreground text-sm leading-none font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to={profilePath}
                  className="focus:bg-accent/60 w-full cursor-pointer transition-colors"
                >
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors"
              >
                <LogoutIcon className="mr-2 size-4 shrink-0" />
                <span>{isLoggingOut ? 'Signing out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default AppHeader;

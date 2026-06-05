import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggler from '@/helper/ThemeToggler';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
import { SCHOOL_ADMIN } from '@/lib/icons';

const PAGE_META = {
  '/school/dashboard': {
    title: 'Dashboard',
    desc: 'School administration overview',
  },
  '/school/departments': {
    title: 'Departments',
    desc: 'Manage academic and admin departments',
  },
  '/school/staff': {
    title: 'Staff Directory',
    desc: 'View and manage staff members',
  },
  '/school/staff/register': {
    title: 'Register Staff',
    desc: 'Onboard a new staff member',
  },
  '/school/profile': {
    title: 'Account Settings',
    desc: 'Personal details and security',
  },
};

const SchoolAdminHeader = () => {
  const { user } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const { pathname } = useLocation();

  const meta = PAGE_META[pathname] || { title: 'School Admin', desc: '' };

  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    'AD';

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        {/* Mobile only trigger */}
        <SidebarTrigger className="md:hidden" />
        <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />

        <div className="flex flex-col">
          <h2 className="text-sm leading-none font-semibold">{meta.title}</h2>
          <p className="text-muted-foreground mt-1 hidden text-[11px] leading-none sm:block">
            {meta.desc}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggler />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/school/profile" className="w-full cursor-pointer">
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <SCHOOL_ADMIN.LOGOUT className="mr-2 h-4 w-4 shrink-0" />
                <span>{isLoggingOut ? 'Signing out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default SchoolAdminHeader;

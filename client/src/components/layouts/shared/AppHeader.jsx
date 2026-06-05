import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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

/**
 * Config-driven header shared by every role layout.
 * Renders a breadcrumb (root → current page) plus theme + account menu.
 *
 * @param {string} rootLabel        breadcrumb root (e.g. 'Super Admin')
 * @param {string} home             root link target
 * @param {string} profilePath      account-menu profile link
 * @param {Record<string,string>} pageLabels  pathname → page title
 * @param {any}    LogoutIcon       lucide icon for the logout item
 */
const AppHeader = ({
  rootLabel,
  home,
  profilePath,
  pageLabels,
  LogoutIcon,
  fallbackInitials = 'U',
}) => {
  const { user } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const { pathname } = useLocation();

  const current = pageLabels[pathname] ?? rootLabel;

  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    fallbackInitials;

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 border-border/60 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-md transition-colors duration-300">
      {/* Mobile-only sidebar toggle */}
      <SidebarTrigger className="md:hidden" />
      <Separator orientation="vertical" className="mr-1 h-4 md:hidden" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:inline-flex">
            <BreadcrumbLink asChild>
              <Link
                to={home}
                className="hover:text-primary transition-colors duration-200"
              >
                {rootLabel}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:inline-flex" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground/90 font-semibold transition-colors duration-200">
              {current}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggler className="transition-transform duration-200 hover:rotate-12" />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="Open account menu"
                className="group hover:bg-accent/60 h-auto cursor-pointer gap-2.5 rounded-full px-2.5 py-1.5 transition-all duration-200"
              >
                <Avatar className="size-8 border transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage
                    src={user.avatar_url || undefined}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left sm:flex">
                  <span className="text-foreground group-hover:text-primary text-sm leading-none font-medium transition-colors">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-muted-foreground mt-0.5 text-[11px] leading-none capitalize">
                    {user.role_name?.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="text-muted-foreground/60 hidden size-4 transition-transform duration-200 group-hover:translate-y-0.5 sm:block" />
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

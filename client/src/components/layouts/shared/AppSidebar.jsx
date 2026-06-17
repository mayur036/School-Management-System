import { Link, useLocation } from 'react-router-dom';

import StatusBadge from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { BASE } from '@/lib/icons';
import { cn } from '@/lib/utils';

// Active nav uses a quiet primary tint (per design system), never a full fill.
const NavItem = ({ to, label, Icon, end }) => {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = end
    ? pathname === to
    : pathname === to || pathname.startsWith(to + '/');

  const handleClick = () => {
    // Close the mobile sidebar sheet on navigation
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton asChild tooltip={label}>
        <Link
          to={to}
          onClick={handleClick}
          className={cn(
            'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
            isActive
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-foreground/80 hover:bg-sidebar-accent/50 hover:text-foreground'
          )}
        >
          {isActive && (
            <span className="bg-primary absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-r-full" />
          )}
          <Icon
            className={cn(
              'size-4.5 shrink-0',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          <span>
            {label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/**
 * Config-driven sidebar shared by every role layout.
 */
const AppSidebar = ({ groups, profilePath = '/', fallbackInitials = 'U' }) => {
  const { user } = useAuth();
  console.log(user);
  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    fallbackInitials;

  return (
    <Sidebar collapsible="offcanvas" className="bg-sidebar border-r">
      {/* Brand */}
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground border-primary/5 flex size-10 shrink-0 items-center justify-center rounded-xl border">
              <BASE.GRADUATION_CAP className="size-6" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sidebar-foreground text-sm leading-none font-bold tracking-tight">
                CampusCore
              </span>
              <span className="text-muted-foreground mt-1 truncate text-[10px] leading-none">
                School Management System
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* <SidebarSeparator /> */}

      {/* Navigation */}
      <SidebarContent className="px-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="text-muted-foreground/60 mb-1 px-3 text-[10px] font-bold tracking-wider uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Role status card */}
      <div className="border-t px-4 py-3">
        <div className="border-primary/10 bg-primary/5 dark:border-primary/20 dark:bg-primary/5 rounded-xl border p-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary dark:bg-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <BASE.SHIELD className="size-4.5" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-sidebar-foreground line-clamp-2 text-xs font-bold capitalize">
                {user?.role_name === 'super_admin'
                  ? 'super admin'
                  : user?.school_name}
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {(user?.role_name === 'school_admin' ||
                  user?.role_name === 'staff') &&
                  user?.school_status && (
                    <StatusBadge
                      status={user.school_status}
                      className="h-4 min-h-0 shrink-0 px-1.5 py-0 text-[9px]"
                    />
                  )}
                <span className="text-muted-foreground text-[10px] leading-normal">
                  {user?.role_name === 'super_admin'
                    ? 'Full system access & control.'
                    : user?.role_name === 'school_admin'
                      ? 'School & staff directory management.'
                      : 'Access assigned department tools.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with user info */}
      <SidebarFooter className="border-t border-gray-200 p-3">
        {user && (
          <Link
            to={profilePath}
            className="group/footer border-border/0 hover:border-border/40 hover:bg-sidebar-accent/50 text-sidebar-foreground flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-2"
          >
            <div className="relative">
              <Avatar className="size-8 border">
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
            <div className="flex min-w-0 flex-col leading-none">
              <span className="group-hover/footer:text-primary truncate text-sm font-semibold">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-muted-foreground mt-1 truncate text-[10px]">
                {user.email}
              </span>
            </div>
            <BASE.CHEVRON_RIGHT className="text-muted-foreground/45 ml-auto size-3.5 shrink-0" />
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Active nav uses a quiet primary tint (per design system), never a full fill.
const NavItem = ({ to, label, Icon, end }) => {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  // When `end` is true, only exact match highlights the item.
  // Otherwise, prefix matching activates parent routes for child pages.
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
            'group relative flex w-full items-center gap-3 rounded-lg py-2 pr-3 pl-3.5 text-sm font-medium transition-all duration-300',
            isActive
              ? 'bg-primary/8 text-primary font-semibold'
              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
          )}
        >
          {isActive && (
            <span className="bg-primary absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-r-full transition-all duration-300" />
          )}
          <Icon
            className={cn(
              'size-4 shrink-0 transition-all duration-300',
              isActive
                ? 'text-primary scale-105'
                : 'group-hover:text-foreground group-hover:scale-105'
            )}
          />
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            {label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/**
 * Config-driven sidebar shared by every role layout.
 *
 * @param {{ name: string, subtitle: string }} brand
 * @param {{ label: string, items: { to: string, label: string, Icon: any }[] }[]} groups
 * @param {string} home  the dashboard landing route
 * @param {string} profilePath  the profile settings page path
 * @param {string} fallbackInitials  shown before the user loads
 */
const AppSidebar = ({
  brand,
  groups,
  profilePath = '/',
  fallbackInitials = 'U',
}) => {
  const { user } = useAuth();

  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    fallbackInitials;

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      {/* Brand */}
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-bold"
          >
            SMS
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-none font-bold tracking-tight">
              {brand.name}
            </span>
            <span className="text-muted-foreground mt-1 text-[11px] leading-none">
              {brand.subtitle}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] font-semibold tracking-wider uppercase">
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

      {/* Footer with user info */}
      <SidebarSeparator />
      <SidebarFooter className="p-3">
        {user && (
          <Link
            to={profilePath}
            className="group/footer border-border/0 hover:border-border/40 hover:bg-sidebar-accent/50 text-sidebar-foreground flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-2 transition-all duration-200 hover:shadow-xs"
          >
            <Avatar className="size-8 border transition-transform duration-200 group-hover/footer:scale-105">
              <AvatarImage
                src={user.avatar_url || undefined}
                alt={`${user.first_name} ${user.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="group-hover/footer:text-primary truncate text-sm leading-none font-medium transition-colors">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-muted-foreground mt-1.5 truncate text-[11px] leading-none">
                {user.email}
              </span>
            </div>
            <ChevronRight className="text-muted-foreground/30 ml-auto size-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover/footer:translate-x-0 group-hover/footer:opacity-100" />
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

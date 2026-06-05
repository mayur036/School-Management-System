import { NavLink } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Active nav uses a quiet primary tint (per design system), never a full fill.
const NavItem = ({ to, label, Icon }) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild tooltip={label}>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          cn(
            'transition-colors',
            isActive &&
              'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-medium'
          )
        }
      >
        <Icon className="size-4 shrink-0" />
        <span>{label}</span>
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

/**
 * Config-driven sidebar shared by every role layout.
 *
 * @param {{ name: string, subtitle: string }} brand
 * @param {{ label: string, items: { to: string, label: string, Icon: any }[] }[]} groups
 * @param {string} fallbackInitials  shown before the user loads
 */
const AppSidebar = ({ brand, groups, fallbackInitials = 'U' }) => {
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
            E
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
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
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
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <Avatar className="size-8 border">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm leading-none font-medium">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-muted-foreground mt-1 truncate text-[11px] leading-none">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

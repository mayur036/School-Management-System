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
import { SCHOOL_ADMIN } from '@/lib/icons';
import { cn } from '@/lib/utils';

const MAIN_NAV = [
  { to: '/school/dashboard', label: 'Dashboard', Icon: SCHOOL_ADMIN.DASHBOARD },
];

const MANAGEMENT_NAV = [
  {
    to: '/school/departments',
    label: 'Departments',
    Icon: SCHOOL_ADMIN.DEPARTMENTS,
  },
  {
    to: '/school/staff',
    label: 'Staff Directory',
    Icon: SCHOOL_ADMIN.STAFF_LIST,
  },
  {
    to: '/school/staff/register',
    label: 'Register Staff',
    Icon: SCHOOL_ADMIN.REGISTER_STAFF,
  },
];

const ACCOUNT_NAV = [
  { to: '/school/profile', label: 'Profile', Icon: SCHOOL_ADMIN.PROFILE },
];

const NavItem = ({ to, label, Icon }) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild tooltip={label}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            isActive &&
              'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          )
        }
        end
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

const SchoolAdminSidebar = () => {
  const { user } = useAuth();

  const initials =
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() ||
    'AD';

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      {/* Brand */}
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-none font-bold tracking-tight">
              EduManage
            </span>
            <span className="text-muted-foreground mt-1 text-[11px] leading-none">
              School Administration
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MANAGEMENT_NAV.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ACCOUNT_NAV.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarSeparator />
      <SidebarFooter className="p-3">
        {user && (
          <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <Avatar className="h-8 w-8 border">
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

export default SchoolAdminSidebar;

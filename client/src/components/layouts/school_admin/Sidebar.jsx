import { NavLink } from 'react-router-dom';

import { SCHOOL_ADMIN } from '@/lib/icons';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/school/dashboard', label: 'Dashboard', Icon: SCHOOL_ADMIN.DASHBOARD },
  { to: '/school/profile', label: 'Profile', Icon: SCHOOL_ADMIN.PROFILE },
];

const linkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  );

const SchoolAdminSidebar = ({ className }) => {
  return (
    <aside
      className={cn(
        'bg-background flex w-60 flex-col gap-1 border-r p-4',
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2 px-2">
        <SCHOOL_ADMIN.STAFF_MANAGE className="text-primary h-5 w-5" />
        <span className="font-semibold tracking-tight">School Admin</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={linkClass} end>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SchoolAdminSidebar;

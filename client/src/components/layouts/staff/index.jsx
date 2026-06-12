import { STAFF } from '@/lib/icons';

import RoleLayout from '../shared/RoleLayout';

const config = {
  brand: { name: 'CampusCore', subtitle: 'Staff Portal' },
  rootLabel: 'Staff',
  home: '/staff/dashboard',
  profilePath: '/staff/profile',
  fallbackInitials: 'ST',
  LogoutIcon: STAFF.LOGOUT,
  groups: [
    {
      label: 'Overview',
      items: [
        { to: '/staff/dashboard', label: 'Dashboard', Icon: STAFF.HOME },
        { to: '/staff/schedule', label: 'My Schedule', Icon: STAFF.SCHEDULE },
        {
          to: '/staff/attendance',
          label: 'Attendance & Leaves',
          Icon: STAFF.ATTENDANCE,
        },
        { to: '/staff/tasks', label: 'My Tasks', Icon: STAFF.TASKS },
      ],
    },
    {
      label: 'Account',
      items: [{ to: '/staff/profile', label: 'Profile', Icon: STAFF.PROFILE }],
    },
  ],
};

const StaffLayout = () => <RoleLayout config={config} />;

export default StaffLayout;

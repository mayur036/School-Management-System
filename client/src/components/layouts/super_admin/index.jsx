import { SUPER_ADMIN } from '@/lib/icons';

import RoleLayout from '../shared/RoleLayout';

const config = {
  brand: { name: 'EduManage', subtitle: 'Super Admin Panel' },
  rootLabel: 'Super Admin',
  home: '/super/dashboard',
  profilePath: '/super/profile',
  fallbackInitials: 'SA',
  LogoutIcon: SUPER_ADMIN.LOGOUT,
  groups: [
    {
      label: 'Overview',
      items: [
        {
          to: '/super/dashboard',
          label: 'Dashboard',
          Icon: SUPER_ADMIN.DASHBOARD,
        },
      ],
    },
    {
      label: 'Management',
      items: [
        { to: '/super/schools', label: 'Schools', Icon: SUPER_ADMIN.SCHOOLS },
      ],
    },
    {
      label: 'Account',
      items: [
        { to: '/super/profile', label: 'Profile', Icon: SUPER_ADMIN.PROFILE },
      ],
    },
  ],
};

const SuperAdminLayout = () => <RoleLayout config={config} />;

export default SuperAdminLayout;

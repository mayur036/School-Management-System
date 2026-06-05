import { SCHOOL_ADMIN } from '@/lib/icons';

import RoleLayout from '../shared/RoleLayout';

const config = {
  brand: { name: 'CampusCore', subtitle: 'School Administration' },
  rootLabel: 'School Admin',
  home: '/school/dashboard',
  profilePath: '/school/profile',
  fallbackInitials: 'AD',
  LogoutIcon: SCHOOL_ADMIN.LOGOUT,
  groups: [
    {
      label: 'Overview',
      items: [
        {
          to: '/school/dashboard',
          label: 'Dashboard',
          Icon: SCHOOL_ADMIN.DASHBOARD,
        },
      ],
    },
    {
      label: 'Management',
      items: [
        {
          to: '/school/departments',
          label: 'Departments',
          Icon: SCHOOL_ADMIN.DEPARTMENTS,
        },
        {
          to: '/school/staff',
          label: 'Staff Directory',
          Icon: SCHOOL_ADMIN.STAFF_LIST,
          end: true,
        },
        {
          to: '/school/staff/register',
          label: 'Register Staff',
          Icon: SCHOOL_ADMIN.REGISTER_STAFF,
        },
      ],
    },
    {
      label: 'Account',
      items: [
        { to: '/school/profile', label: 'Profile', Icon: SCHOOL_ADMIN.PROFILE },
      ],
    },
  ],
};

const SchoolAdminLayout = () => <RoleLayout config={config} />;

export default SchoolAdminLayout;

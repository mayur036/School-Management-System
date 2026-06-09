import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';

export const getMetrics = (user, data = {}) => {
  if (user.role_name === 'super_admin') {
    return [
      {
        label: 'Total Schools',
        value: '24',
        icon: COMMON.BUILDING,
        color: 'text-blue-500 bg-blue-500/10 border-l-blue-500',
        trend: '12% from last month',
      },
      {
        label: 'Total Staff',
        value: '1,248',
        icon: SCHOOL_ADMIN.STAFF_LIST,
        color: 'text-emerald-500 bg-emerald-500/10 border-l-emerald-500',
        trend: '8.4% from last month',
      },
      {
        label: 'Active Staff',
        value: '1,081',
        icon: COMMON.CHECK,
        color: 'text-amber-500 bg-amber-500/10 border-l-amber-500',
        trend: '9.1% from last month',
      },
      {
        label: 'Total Logins',
        value: '324',
        icon: COMMON.SHIELD_CHECK,
        color: 'text-purple-500 bg-purple-500/10 border-l-purple-500',
        trend: '15.3% from last month',
      },
      {
        label: 'Activity Score',
        value: '98%',
        icon: COMMON.ACTIVITY,
        color: 'text-pink-500 bg-pink-500/10 border-l-pink-500',
        trend: 'Excellent',
      },
    ];
  } else if (user.role_name === 'school_admin') {
    const deptsCount = data.deptsCount ?? 0;
    const staffCount = data.staffCount ?? 0;
    const activeStaffCount = data.activeStaffCount ?? 0;
    const activePct =
      staffCount > 0 ? Math.round((activeStaffCount / staffCount) * 100) : 0;
    return [
      {
        label: 'Departments',
        value: String(deptsCount),
        icon: SCHOOL_ADMIN.DEPARTMENTS,
        color: 'text-blue-500 bg-blue-500/10 border-l-blue-500',
        trend: 'Active departments',
      },
      {
        label: 'Staff Count',
        value: String(staffCount),
        icon: SCHOOL_ADMIN.STAFF_LIST,
        color: 'text-emerald-500 bg-emerald-500/10 border-l-emerald-500',
        trend: 'Across all departments',
      },
      {
        label: 'Active Staff',
        value: String(activeStaffCount),
        icon: COMMON.CHECK,
        color: 'text-amber-500 bg-amber-500/10 border-l-amber-500',
        trend: `${activePct}% active`,
      },
      {
        label: 'Total Logins',
        value: '112',
        icon: COMMON.SHIELD_CHECK,
        color: 'text-purple-500 bg-purple-500/10 border-l-purple-500',
        trend: '10.2% from last week',
      },
      {
        label: 'Activity Score',
        value: '99%',
        icon: COMMON.ACTIVITY,
        color: 'text-pink-500 bg-pink-500/10 border-l-pink-500',
        trend: 'Very Active',
      },
    ];
  } else {
    return [
      {
        label: 'Assignments',
        value: '6',
        icon: SCHOOL_ADMIN.DEPARTMENTS,
        color: 'text-blue-500 bg-blue-500/10 border-l-blue-500',
        trend: '2 pending',
      },
      {
        label: 'Work Hours',
        value: '40h',
        icon: COMMON.CLOCK,
        color: 'text-emerald-500 bg-emerald-500/10 border-l-emerald-500',
        trend: 'Full-time',
      },
      {
        label: 'Completed Tasks',
        value: '18',
        icon: COMMON.CHECK,
        color: 'text-amber-500 bg-amber-500/10 border-l-amber-500',
        trend: '100% completion rate',
      },
      {
        label: 'Login Count',
        value: '84',
        icon: COMMON.SHIELD_CHECK,
        color: 'text-purple-500 bg-purple-500/10 border-l-purple-500',
        trend: 'Daily user',
      },
      {
        label: 'Reliability',
        value: '97%',
        icon: COMMON.ACTIVITY,
        color: 'text-pink-500 bg-pink-500/10 border-l-pink-500',
        trend: 'Excellent',
      },
    ];
  }
};

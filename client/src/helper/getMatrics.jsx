import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';

/**
 * Profile metric tiles. Only real, data-backed metrics are returned.
 * Roles without an aggregate data source on the profile page return an
 * empty array (the metrics row is hidden in that case).
 */
export const getMetrics = (user, data = {}) => {
  if (user?.role_name === 'school_admin') {
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
    ];
  }

  // No aggregate data source for super_admin / staff on this page yet.
  return [];
};

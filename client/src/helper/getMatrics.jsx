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
        Icon: SCHOOL_ADMIN.DEPARTMENTS,
        accentClassName: 'border-l-blue-500',
        iconChipClassName:
          'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        subtext: 'Active departments',
      },
      {
        label: 'Staff Count',
        value: String(staffCount),
        Icon: SCHOOL_ADMIN.STAFF_LIST,
        accentClassName: 'border-l-emerald-500',
        iconChipClassName:
          'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
        subtext: 'Across all departments',
      },
      {
        label: 'Active Staff',
        value: String(activeStaffCount),
        Icon: COMMON.CHECK,
        accentClassName: 'border-l-amber-500',
        iconChipClassName:
          'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
        subtext: `${activePct}% active`,
      },
    ];
  }

  // No aggregate data source for super_admin / staff on this page yet.
  return [];
};

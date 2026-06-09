import { formatDate } from '@/lib/utils';

import {
  DEPARTMENT_DESCRIPTIONS,
  DEPARTMENT_GRADIENTS,
  DEPARTMENT_ICONS,
  NEW_DEPT_CUTOFF_DAYS,
} from '../constants/departments.constants';

/**
 * Get matching description for a department name.
 */
export const getDeptDescription = (deptName) => {
  if (!deptName) return DEPARTMENT_DESCRIPTIONS.default;
  const name = deptName.toLowerCase();
  for (const key of Object.keys(DEPARTMENT_DESCRIPTIONS)) {
    if (name.includes(key)) {
      return DEPARTMENT_DESCRIPTIONS[key];
    }
  }
  return DEPARTMENT_DESCRIPTIONS.default;
};

/**
 * Get matching styling gradient class for a department.
 */
export const getDeptGradient = (deptName) => {
  if (!deptName) return DEPARTMENT_GRADIENTS.default;
  const name = deptName.toLowerCase();
  for (const key of Object.keys(DEPARTMENT_GRADIENTS)) {
    if (name.includes(key)) {
      return DEPARTMENT_GRADIENTS[key];
    }
  }
  return DEPARTMENT_GRADIENTS.default;
};

/**
 * Get matching icon component for a department.
 */
export const getDeptIcon = (deptName) => {
  if (!deptName) return DEPARTMENT_ICONS.default;
  const name = deptName.toLowerCase();
  for (const key of Object.keys(DEPARTMENT_ICONS)) {
    if (name.includes(key)) {
      return DEPARTMENT_ICONS[key];
    }
  }
  return DEPARTMENT_ICONS.default;
};

/**
 * Outline-badge colour classes for a department name, used in the staff
 * directory's department column.
 */
export const getDeptBadgeClass = (deptName) => {
  if (!deptName) return 'bg-muted/50 text-muted-foreground border-border';
  const name = deptName.toLowerCase();
  if (name.includes('math')) {
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  }
  if (name.includes('science')) {
    return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20';
  }
  if (
    name.includes('lang') ||
    name.includes('literature') ||
    name.includes('english')
  ) {
    return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
  }
  if (name.includes('admin') || name.includes('office')) {
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
  }
  if (name.includes('account') || name.includes('finance')) {
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  }
  return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
};

/**
 * Status dot + label for a department row/card. Active departments created
 * within NEW_DEPT_CUTOFF_DAYS are surfaced as "New".
 */
export const getDeptStatusMeta = (dept) => {
  const cutoff = Date.now() - NEW_DEPT_CUTOFF_DAYS * 24 * 60 * 60 * 1000;
  const isNew = new Date(dept.created_at).getTime() > cutoff;
  if (dept.status !== 'active') {
    return { dotClass: 'bg-red-500', label: 'inactive' };
  }
  return isNew
    ? { dotClass: 'bg-blue-500', label: 'New' }
    : { dotClass: 'bg-green-500', label: 'active' };
};

/**
 * Page-level department metrics: totals, average staff per department and
 * the most recently created department.
 */
export const computeDepartmentMetrics = (departments = [], staff = []) => {
  const totalDepts = departments.length;
  const totalStaff = staff.length;
  const avgStaff =
    totalDepts > 0 ? (totalStaff / totalDepts).toFixed(1) : '0.0';

  let latestDeptName = 'None';
  let latestDeptDateStr = '—';
  if (totalDepts > 0) {
    const [latest] = [...departments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    latestDeptName = latest.name;
    latestDeptDateStr = formatDate(latest.created_at, 'short');
  }

  return {
    totalDepts,
    totalStaff,
    avgStaff,
    latestDeptName,
    latestDeptDateStr,
  };
};

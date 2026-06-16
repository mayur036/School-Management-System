import { formatDate } from '@/lib/utils';

import {
  DEPARTMENT_DESCRIPTIONS,
  DEPARTMENT_GRADIENTS,
  DEPARTMENT_ICONS,
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

export const computeDepartmentStats = (departments = [], staff = []) => {
  const total = departments.length;
  const totalStaff = staff.length;
  const avgStaff = total > 0 ? (totalStaff / total).toFixed(1) : '0.0';

  let latestDeptName = 'None';
  let latestDeptDateStr = '—';
  if (total > 0) {
    const [latest] = [...departments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    latestDeptName = latest.name;
    latestDeptDateStr = formatDate(latest.created_at, 'short');
  }

  return {
    total,
    staff: totalStaff,
    avg: avgStaff,
    latestName: latestDeptName,
    latestDate: latestDeptDateStr,
  };
};

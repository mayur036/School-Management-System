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

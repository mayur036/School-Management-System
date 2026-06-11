/**
 * @file index.js
 * @description Central export for all CampusCore icon sets.
 *
 * Usage guide:
 *
 *   // Role-specific icons
 *   import { SUPER_ADMIN, SCHOOL_ADMIN, STAFF } from '@/lib/icons';
 *
 *   // Universal icons (not role-specific)
 *   import { BASE } from '@/lib/icons';
 *
 *   // Semantic UI pattern icons
 *   import { STATUS, STATS, ACTIONS, EMPTY_STATE } from '@/lib/icons';
 *
 * Example:
 *   const Icon = SUPER_ADMIN.DASHBOARD;
 *   <Icon className="size-4" />
 */

// Role-scoped icon maps
export { BASE } from './base.icons';
export { SCHOOL_ADMIN } from './schoolAdmin.icons';
export { STAFF } from './staff.icons';
export { SUPER_ADMIN } from './superAdmin.icons';

// Semantic UI pattern icon maps
export { ACTIONS, EMPTY_STATE, STATS, STATUS } from './ui.icons';

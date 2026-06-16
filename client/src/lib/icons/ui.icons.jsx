/**
 * @file ui.icons.jsx
 * @description Semantic icon sets for reusable UI patterns.
 * Use these in stat cards, status badges, action menus, and empty states.
 * These are NOT role-specific — they represent UI concepts, not features.
 */

import {
  BadgeCheck,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  ChartColumnIncreasing,
  CircleCheck,
  CircleOff,
  CircleX,
  FileQuestion,
  PackageOpen,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  School,
  ServerCrash,
  Trash2,
  TriangleAlert,
  UserCheck,
  UserCog,
  Users,
  UserX,
} from 'lucide-react';

/**
 * Status indicators for active/inactive/error states.
 * Used in tables, badges, and stat cards.
 */
export const STATUS = {
  ACTIVE: CircleCheck,
  INACTIVE: CircleOff,
  ERROR: CircleX,
  WARNING: TriangleAlert,
  VERIFIED: BadgeCheck,
};

/**
 * Dashboard stat card icons.
 * Map directly to metric names for predictable usage.
 */
export const STATS = {
  TOTAL_SCHOOLS: School,
  ACTIVE_SCHOOLS: CircleCheck,
  INACTIVE_SCHOOLS: CircleOff,
  TOTAL_ADMINS: UserCog,
  ACTIVE_ADMINS: UserCheck,
  INACTIVE_ADMINS: UserX,
  TOTAL_STAFF: Users,
  ACTIVE_STAFF: BadgeCheck,
  INACTIVE_STAFF: UserX,
  AVG_STAFF_PER_SCHOOL: ChartColumnIncreasing,
  TOTAL_DEPARTMENTS: Building2,
  TOTAL_LEAVES: Calendar,
  APPROVED_LEAVES: CalendarCheck,
  PENDING_LEAVES: CalendarClock,
  REJECTED_LEAVES: CalendarX,
  ANNUAL_LEAVES: CalendarDays,
  CASUAL_LEAVES: Calendar,
  SICK_LEAVES: CalendarX,
  TOTAL_ATTENDANCE: Users,
  PRESENT: CircleCheck,
  ABSENT: CircleOff,
  LATE: TriangleAlert,
};

/**
 * CRUD / row-action icons.
 * Use in DataTable action columns and context menus.
 */
export const ACTIONS = {
  CREATE: Plus,
  EDIT: Pencil,
  DELETE: Trash2,
  RESTORE: RotateCcw,
  REFRESH: RefreshCw,
};

/**
 * Empty and error state illustrations.
 * Use in empty tables, 404 pages, and error boundaries.
 */
export const EMPTY_STATE = {
  NO_DATA: PackageOpen,
  NO_FILE: FileQuestion,
  SERVER_ERROR: ServerCrash,
  NO_TIMETABLE: CalendarClock,
};

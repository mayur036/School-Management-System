/**
 * @file superAdmin.icons.jsx
 * @description Icons scoped to the Super Admin role.
 * Super Admin manages the platform: schools, admins, system health, billing.
 */

import {
  Activity,
  BadgeCheck,
  Building2,
  ChartColumnIncreasing,
  CircleCheck,
  CircleOff,
  Cpu,
  KeyRound,
  LayoutDashboard,
  LogOut,
  School,
  Settings,
  ShieldAlert,
  UserCheck,
  UserCog,
  UserPlus,
  UserRound,
  Users,
  UserX,
} from 'lucide-react';

export const SUPER_ADMIN = {
  // Sidebar Navigation
  DASHBOARD: LayoutDashboard,
  SCHOOLS: School,
  ADMINS: UserCog,
  USERS: Users,
  SETTINGS: Settings,
  LOGOUT: LogOut,

  // Profile
  PROFILE: UserRound,

  // School Actions
  ADD_SCHOOL: School,
  SCHOOL_ACTIVE: CircleCheck,
  SCHOOL_INACTIVE: CircleOff,

  // Admin Actions
  CREATE_ADMIN: UserPlus,
  MANAGE_ADMIN: UserCog,
  ADMIN_ACTIVE: UserCheck,
  ADMIN_INACTIVE: UserX,

  // Stats / Analytics
  STATS_SCHOOLS: Building2,
  STATS_ADMINS: UserCog,
  STATS_STAFF: BadgeCheck,
  STATS_AVG_STAFF: ChartColumnIncreasing,

  // System
  SECURITY: ShieldAlert,
  PERMISSIONS: KeyRound,
  SYSTEM_HEALTH: Activity,
  SYSTEM_MONITOR: Cpu,
};

export default SUPER_ADMIN;

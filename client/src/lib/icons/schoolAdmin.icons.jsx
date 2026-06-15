/**
 * @file schoolAdmin.icons.jsx
 * @description Icons scoped to the School Admin role.
 * School Admin manages one school: staff, departments, academics, finance.
 */

import {
  Atom,
  Award,
  Binary,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Contact,
  Dumbbell,
  FileBarChart2,
  FileText,
  FolderTree,
  Globe,
  GraduationCap,
  Heart,
  LayoutDashboard,
  Library,
  Lightbulb,
  LogOut,
  MonitorCheck,
  Palette,
  Receipt,
  School,
  Settings,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';

export const SCHOOL_ADMIN = {
  // Sidebar Navigation
  DASHBOARD: LayoutDashboard,
  SCHOOL_PROFILE: School,
  DEPARTMENTS: Building2,
  STAFF: Users,
  STUDENTS: GraduationCap,
  TIMETABLE: CalendarCheck,
  ATTENDANCE: CalendarDays,
  REPORTS: FileBarChart2,
  SETTINGS: Settings,
  LOGOUT: LogOut,

  // Profile
  PROFILE: UserRound,

  // Staff Management
  STAFF_LIST: Users,
  REGISTER_STAFF: UserPlus,
  STAFF_MANAGE: UserCheck,
  STAFF_ROLES: Contact,
  STAFF_PERFORMANCE: MonitorCheck,
  EMPLOYEE_ATTENDANCE: ClipboardList,

  // Department
  DEPARTMENT_LIST: Briefcase,
  DEPARTMENT_TREE: FolderTree,

  // Department Types
  DEPT_ARTS: Palette,
  DEPT_HUMANITIES: Globe,
  DEPT_LANGUAGES: BookOpen,
  DEPT_MATHEMATICS: Binary,
  DEPT_SCIENCE: Atom,
  DEPT_PHYSICAL: Dumbbell,
  DEPT_RESEARCH: Lightbulb,
  DEPT_STUDENT: Heart,
  DEPT_DEFAULT: Building2,

  // Academic
  CLASSES: BookOpen,
  SUBJECTS: ClipboardList,
  EXAMS: Award,
  DOCUMENTS: FileText,

  // Finance
  FEES: Receipt,
  PAYROLL: Wallet,

  // Resources
  LIBRARY: Library,
  TRANSPORT: Bus,
};

export default SCHOOL_ADMIN;

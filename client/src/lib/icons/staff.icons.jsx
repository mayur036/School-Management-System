/**
 * @file staff.icons.jsx
 * @description Icons scoped to the Staff role.
 * Staff sees their schedule, tasks, attendance, documents, and notifications.
 */

import {
  Bell,
  BookMarked,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  UserRound,
} from 'lucide-react';

export const STAFF = {
  // Sidebar Navigation
  HOME: Home,
  SCHEDULE: CalendarDays,
  ATTENDANCE: ClipboardCheck,
  TASKS: ClipboardList,
  DOCUMENTS: FileText,
  NOTIFICATIONS: Bell,
  MESSAGES: MessageSquare,
  SETTINGS: Settings,
  LOGOUT: LogOut,

  // Profile
  PROFILE: UserRound,

  // Detail Views
  LEAVE_REQUEST: CalendarDays,
  TIME_LOG: Clock3,
  SUBJECTS: BookMarked,
};

export default STAFF;

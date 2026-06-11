import { BASE } from '@/lib/icons';

export const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  staff: 'Department Staff',
};

export const TABS_LIST = [
  { id: 'profile', label: 'Profile', icon: BASE.USER },
  { id: 'security', label: 'Security', icon: BASE.SHIELD },
  { id: 'notifications', label: 'Notifications', icon: BASE.BELL },
  { id: 'activity', label: 'Activity Logs', icon: BASE.CLOCK },
  { id: 'preferences', label: 'Preferences', icon: BASE.SETTINGS },
];

export const languagePreference = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'fr', label: 'French' },
];

export const timezonePreference = [
  {
    label: '(GMT+05:30) Asia/Kolkata',
    value: 'Asia/Kolkata',
  },
  {
    label: '(GMT-05:00) America/New_York',
    value: 'America/New_York',
  },
  {
    label: '(GMT+01:00) Europe/Berlin',
    value: 'Europe/Berlin',
  },
];

export const QUICK_ACTIONS = [
  {
    title: 'Edit Profile',
    description: 'Update your profile information',
    icon: BASE.USER,
    action: 'edit-profile',
  },
  {
    title: 'Change Password',
    description: 'Update your password',
    icon: BASE.SHIELD,
    action: 'change-password',
  },
  {
    title: 'Notification Preferences',
    description: 'Update your notification preferences',
    icon: BASE.BELL,
    action: 'notification-preferences',
  },
  {
    title: 'Activity Logs',
    description: 'View your activity logs',
    icon: BASE.CLOCK,
    action: 'activity-logs',
  },
  {
    title: 'Profile Preferences',
    description: 'Update your profile preferences',
    icon: BASE.SETTINGS,
    action: 'profile-preferences',
  },
];

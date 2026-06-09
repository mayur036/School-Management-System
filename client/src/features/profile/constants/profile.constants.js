import { COMMON } from '@/lib/icons';

export const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  school_admin: 'School Administrator',
  staff: 'Department Staff',
};

export const TABS_LIST = [
  { id: 'profile', label: 'Profile', icon: COMMON.USER },
  { id: 'security', label: 'Security', icon: COMMON.SHIELD },
  { id: 'notifications', label: 'Notifications', icon: COMMON.BELL },
  { id: 'activity', label: 'Activity Logs', icon: COMMON.CLOCK },
  { id: 'preferences', label: 'Preferences', icon: COMMON.SETTINGS },
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

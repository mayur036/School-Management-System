import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Build uppercase initials from a person-like object ({ first_name, last_name }).
 * Falls back to 'U' when no name parts are present.
 */
export const getInitials = (person) => {
  if (!person) return 'U';
  const first = person.first_name?.[0] ?? '';
  const last = person.last_name?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || 'U';
};

export const formatStaffId = (id) => `ST-${String(id).padStart(4, '0')}`;

export const formatSchoolId = (id) => `sc-${String(id).padStart(4, '0')}`;

export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '-';
  const nationalNumber = phoneNumber.replace(/^\+\d{1,3}/, '');
  const match = nationalNumber.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    const area = match[1];
    const prefix = match[2];
    const line = match[3];
    return `${area}-${prefix}-${line}`;
  }
  return phoneNumber;
};

export const formatDate = (dateString, format = 'short', code = 'en-GB') => {
  if (!dateString) return '-';

  switch (format) {
    case 'short':
      return new Date(dateString).toLocaleDateString(code);
    case 'long':
      return new Date(dateString).toLocaleDateString(code, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'medium':
      return new Date(dateString).toLocaleDateString(code, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    case 'full':
      return new Date(dateString).toLocaleDateString(code, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return new Date(dateString).toLocaleTimeString(code);
    case 'datetime':
      return new Date(dateString).toLocaleString(code);
    case 'long-time':
      return new Date(dateString).toLocaleString(code, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
    case 'medium-time':
      return new Date(dateString).toLocaleString(code, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    case 'full-time':
      return new Date(dateString).toLocaleString(code, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
    case 'short-time':
      return new Date(dateString).toLocaleString(code, {
        hour: 'numeric',
        minute: 'numeric',
      });
    default:
      return new Date(dateString).toLocaleDateString(code);
  }
};

/**
 * Robustly copies text to the clipboard, falling back to a textarea
 * approach if the Clipboard API is unavailable (e.g. non-secure local IP contexts).
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback for non-secure contexts
  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        resolve();
      } else {
        reject(new Error('Fallback copy failed'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

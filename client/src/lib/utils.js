import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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

  // Remove all non-digit characters to process raw numbers
  const cleaned = phoneNumber.replace(/\D/g, '');

  // 10-digit standard (e.g., US without country code: 1234567890 -> 123-456-7890)
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  // 11-digit US with country code 1 (e.g., 11234567890 -> +1 123-456-7890)
  match = cleaned.match(/^1(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+1 ${match[1]}-${match[2]}-${match[3]}`;
  }

  // 12-digit India with country code 91 (e.g., 919876543210 -> +91 98765-43210)
  match = cleaned.match(/^91(\d{5})(\d{5})$/);
  if (match) {
    return `+91 ${match[1]}-${match[2]}`;
  }

  // 11-digit UK style or others
  match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  // Fallback to original if no pattern matched
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

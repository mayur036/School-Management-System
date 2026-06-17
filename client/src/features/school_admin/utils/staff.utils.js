import { formatDate } from '@/lib/utils';

export const computeStaffStats = (staff = [], departments = []) => {
  const total = staff.length;
  const active = staff.filter((s) => s.status === 'active').length;
  const inactive = staff.filter((s) => s.status === 'inactive').length;

  let latestName = 'None';
  let latestDate = '—';
  if (total > 0) {
    const [latest] = [...staff].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    latestName = `${latest.first_name} ${latest.last_name}`;
    latestDate = formatDate(latest.created_at, 'medium');
  }

  return {
    total,
    active,
    inactive,
    departments: departments.length,
    latestName,
    latestDate,
  };
};

export const groupStaffByDepartmentName = (
  staff = [],
  departments = [],
  limit = 8
) => {
  const counts = departments.map((d) => ({
    name: d.name,
    count: staff.filter((s) => s.department_name === d.name).length,
  }));
  const unassigned = staff.filter((s) => !s.department_name).length;
  if (unassigned > 0) counts.push({ name: 'Unassigned', count: unassigned });
  return counts.sort((a, b) => b.count - a.count).slice(0, limit);
};

/** Map of department_id -> staff count. */
export const countStaffByDepartmentId = (staff = []) => {
  const counts = {};
  staff.forEach((s) => {
    if (s.department_id) {
      counts[s.department_id] = (counts[s.department_id] || 0) + 1;
    }
  });
  return counts;
};

/** Most recently created staff, newest first. */
export const getRecentStaff = (staff = [], limit = 5) =>
  [...staff]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);

/** Generate a 12-char password with at least one of each character class. */
export const generateSecurePassword = () => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~';
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

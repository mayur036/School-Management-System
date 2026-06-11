import { format, parseISO } from 'date-fns';

export const computeSuperAdminStats = (schools = [], admins = []) => {
  const activeSchools = schools.filter((s) => s.status === 'active').length;
  const inactiveSchools = schools.length - activeSchools;

  const activeAdmins = admins.filter((a) => a.status === 'active').length;
  const inactiveAdmins = admins.length - activeAdmins;

  return {
    totalSchools: schools.length,
    activeSchools,
    inactiveSchools,
    totalAdmins: admins.length,
    activeAdmins,
    inactiveAdmins,
  };
};

export const getRecentSchools = (schools = [], limit = 5) => {
  return [...schools]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
};

export const groupSchoolsByMonth = (schools = []) => {
  const counts = {};
  schools.forEach((school) => {
    if (!school.created_at) return;
    const month = format(parseISO(school.created_at), 'MMM yyyy');
    counts[month] = (counts[month] || 0) + 1;
  });

  return Object.entries(counts).map(([month, count]) => ({
    month,
    count,
  }));
};

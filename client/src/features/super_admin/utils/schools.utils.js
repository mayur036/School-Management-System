export const computeSchoolStats = (schools) => {
  if (!schools || !schools.length) {
    return {
      total: 0,
      active: 0,
      activePct: 0,
      inactive: 0,
      joinedThisMonth: 0,
    };
  }

  const total = schools.length;
  const active = schools.filter((s) => s.status === 'active').length;
  const inactive = schools.filter((s) => s.status === 'inactive').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const joinedThisMonth = schools.filter((s) => {
    if (!s.created_at) return false;
    const date = new Date(s.created_at);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  return {
    total,
    active,
    inactive,
    activePct: total > 0 ? Math.round((active / total) * 100) : 0,
    joinedThisMonth,
  };
};

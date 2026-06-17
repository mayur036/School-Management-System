export const computeAdminStats = (admins) => {
  if (!admins || !admins.length) {
    return {
      total: 0,
      active: 0,
      activePct: 0,
      inactive: 0,
      joinedThisMonth: 0,
    };
  }

  const total = admins.length;
  const active = admins.filter((a) => a.status === 'active').length;
  const inactive = admins.filter((a) => a.status === 'inactive').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const joinedThisMonth = admins.filter((a) => {
    if (!a.created_at) return false;
    const date = new Date(a.created_at);
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

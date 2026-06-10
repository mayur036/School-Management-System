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
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  return {
    total,
    active,
    inactive,
    activePct: total > 0 ? Math.round((active / total) * 100) : 0,
    joinedThisMonth,
  };
};

export const exportAdminsToCsv = (admins) => {
  if (!admins || !admins.length) return;

  const headers = [
    'Admin ID',
    'Name',
    'Email',
    'Phone',
    'School Name',
    'Status',
    'Registered Date',
  ];

  const csvRows = [headers.join(',')];

  for (const admin of admins) {
    const row = [
      admin.staff_id,
      `"${admin.first_name} ${admin.last_name}"`,
      `"${admin.email || ''}"`,
      `"${admin.phone || ''}"`,
      `"${admin.school_name || ''}"`,
      admin.status || 'unknown',
      admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '',
    ];
    csvRows.push(row.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `school_admins_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

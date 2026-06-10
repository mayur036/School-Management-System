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

export const exportSchoolsToCsv = (schools) => {
  if (!schools || !schools.length) return;

  const headers = [
    'School ID',
    'School Name',
    'Domain',
    'Status',
    'Registered Date',
  ];

  const csvRows = [headers.join(',')];

  for (const school of schools) {
    const row = [
      school.school_id,
      `"${school.name?.replace(/"/g, '""') || ''}"`,
      `"${school.domain || ''}"`,
      school.status || 'unknown',
      school.created_at ? new Date(school.created_at).toLocaleDateString() : '',
    ];
    csvRows.push(row.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `schools_export_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

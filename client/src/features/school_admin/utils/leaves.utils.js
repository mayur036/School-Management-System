import { formatDate } from '@/lib/utils';

/**
 * Compute headline stats for leave requests.
 */
export const computeLeaveStats = (leaves = []) => {
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === 'pending').length;
  const approved = leaves.filter((l) => l.status === 'approved').length;
  const rejected = leaves.filter((l) => l.status === 'rejected').length;

  return { total, pending, approved, rejected };
};

/**
 * Get unique leave types from leaves data.
 */
export const getLeaveTypes = (leaves = []) => {
  const types = new Set();
  leaves.forEach((l) => {
    if (l.leave_type) types.add(l.leave_type);
  });
  return Array.from(types).sort();
};

const CSV_HEADERS = [
  'Staff Name',
  'Email',
  'Department',
  'Leave Type',
  'Start Date',
  'End Date',
  'Total Days',
  'Reason',
  'Status',
  'Reviewer',
  'Comments',
];

/**
 * Build a CSV from leave records and trigger a browser download.
 */
export const exportLeavesToCsv = (leaves = []) => {
  const rows = leaves.map((l) => [
    `${l.first_name} ${l.last_name || ''}`.trim(),
    l.email || '',
    l.department_name || 'Staff',
    l.leave_type || '',
    l.start_date ? formatDate(l.start_date, 'short', 'sv-SE') : '',
    l.end_date ? formatDate(l.end_date, 'short', 'sv-SE') : '',
    l.total_days ?? '',
    l.reason || '',
    l.status || '',
    l.reviewer_name || '',
    l.comments || '',
  ]);

  const csvContent = [
    CSV_HEADERS.join(','),
    ...rows.map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const stamp = formatDate(new Date(), 'short', 'sv-SE').replace(/-/g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `leave_requests_${stamp}.csv`);
  link.click();
  URL.revokeObjectURL(url);
};

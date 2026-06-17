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

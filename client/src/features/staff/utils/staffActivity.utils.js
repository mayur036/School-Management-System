import { LEAVE_BALANCE } from '../constants/staffActivity.constants';

export const computeStaffLeavesStats = (leaves = []) => {
  let annualUsed = 0;
  let casualUsed = 0;
  let sickUsed = 0;

  leaves.forEach((leave) => {
    if (leave.status === 'approved') {
      const days = Number(leave.total_days ?? 0);

      if (leave.leave_type === 'Annual Leave') {
        annualUsed += days;
      } else if (leave.leave_type === 'Casual Leave') {
        casualUsed += days;
      } else if (leave.leave_type === 'Sick Leave') {
        sickUsed += days;
      }
    }
  });

  const annualRemaining = Math.max(0, LEAVE_BALANCE.annual.total - annualUsed);
  const casualRemaining = Math.max(0, LEAVE_BALANCE.casual.total - casualUsed);
  const sickRemaining = Math.max(0, LEAVE_BALANCE.sick.total - sickUsed);

  return {
    total: leaves.reduce((acc, l) => acc + Number(l.total_days ?? 0), 0),
    approved: leaves.filter((l) => l.status === 'approved').length,
    annual_leaves: `${annualRemaining} / ${LEAVE_BALANCE.annual.total} days`,
    casual_leaves: `${casualRemaining} / ${LEAVE_BALANCE.casual.total} days`,
    sick_leaves: `${sickRemaining} / ${LEAVE_BALANCE.sick.total} days`,
  };
};

export const computeStaffAttendanceStats = (attendance = []) => {
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === 'present').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const late = attendance.filter((a) => a.status === 'late').length;
  const half_day = attendance.filter((a) => a.status === 'half_day').length;

  let totalWorkSeconds = 0;
  attendance.forEach((a) => {
    if (a.work_duration) {
      const parts = a.work_duration.split(':');
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const s = parts[2] ? parseInt(parts[2], 10) : 0;
        totalWorkSeconds += h * 3600 + m * 60 + s;
      }
    }
  });
  const totalHours = (totalWorkSeconds / 3600).toFixed(1);

  const leave = attendance.filter((a) => a.status === 'leave').length;

  return {
    total,
    present,
    absent,
    late,
    half_day,
    leave,
    totalHours: Number(totalHours),
  };
};

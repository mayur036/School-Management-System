import { Badge } from '@/components/ui/badge';
import { DEPARTMENTS } from '@/constant';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
  present: {
    label: 'Present',
    className: 'bg-success/10 text-success border-success/20',
  },
  absent: {
    label: 'Absent',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
  late: {
    label: 'Late',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  half_day: {
    label: 'Half Day',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  leave: {
    label: 'On Leave',
    className: 'bg-info/10 text-info border-info/20',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border-success/20',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-muted/60 text-muted-foreground border-muted',
  },
  current: {
    label: 'Current',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  upcoming: {
    label: 'Upcoming',
    className: 'bg-info/10 text-info border-info/20',
  },
  total: {
    label: 'Total',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  off: {
    label: 'Off',
    className:
      'bg-muted-foreground/20 text-muted-foreground border-muted-foreground/20',
  },
  default: {
    label: 'Other',
    className: 'bg-muted/60 text-muted-foreground border-muted',
  },
};

const departmenttypeconfig = {
  teaching: {
    label: 'Teaching',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'non-teaching': {
    label: 'Non-Teaching',
    className: 'bg-muted/60 text-muted-foreground border-muted',
  },
  default: {
    label: 'Other',
    className: 'bg-muted/60 text-muted-foreground border-muted',
  },
};

const departmentConfig = {
  arts: {
    label: 'Arts',
    className: 'bg-purple-500/10 text-purple-600 border-purple-200/30',
  },
  humanities: {
    label: 'Humanities',
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/30',
  },
  languages: {
    label: 'Languages',
    className: 'bg-amber-500/10 text-amber-600 border-amber-200/30',
  },
  mathematics: {
    label: 'Mathematics',
    className: 'bg-blue-500/10 text-blue-600 border-blue-200/30',
  },
  science: {
    label: 'Science',
    className: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/30',
  },
  physical: {
    label: 'Physical Education',
    className: 'bg-teal-500/10 text-teal-600 border-teal-200/30',
  },
  research: {
    label: 'Research',
    className: 'bg-orange-500/10 text-orange-600 border-orange-200/30',
  },
  student: {
    label: 'Student Support',
    className: 'bg-pink-500/10 text-pink-600 border-pink-200/30',
  },
  default: {
    label: 'Unassigned',
    className: 'bg-slate-500/10 text-slate-600 border-slate-200/30',
  },
};

const leavetypeconfig = {
  'Casual Leave': {
    label: 'Casual',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'Sick Leave': {
    label: 'Sick',
    className: 'bg-danger/10 text-danger border-danger/20',
  },
  'Emergency Leave': {
    label: 'Emergency',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  'Paid Leave': {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/20',
  },
  'Annual Leave': {
    label: 'Annual',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'Maternity Leave': {
    label: 'Maternity',
    className: 'bg-info/10 text-info border-info/20',
  },
  'Paternity Leave': {
    label: 'Paternity',
    className: 'bg-info/10 text-info border-info/20',
  },
  default: {
    label: 'Other',
    className: 'bg-muted/60 text-muted-foreground border-muted',
  },
};

const StatusBadge = ({ status, className, pulse = false, dot = false }) => {
  const normalizedStatus = status?.toLowerCase() || 'default';
  const config = statusConfig[normalizedStatus] || statusConfig.default;

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'mr-1.5 inline-block size-1.5 rounded-full bg-current',
          !dot && 'hidden',
          pulse && 'animate-pulse'
        )}
      />
      {config.label}
    </Badge>
  );
};

export const LeaveTypeBadge = ({ type, className }) => {
  const config = leavetypeconfig[type] || leavetypeconfig.default;
  return (
    <Badge variant="outline" className={cn(className, config.className)}>
      {config.label}
    </Badge>
  );
};

export const DepartmentTypeBadge = ({ type, className }) => {
  const config = departmenttypeconfig[type] || departmenttypeconfig.default;
  return (
    <Badge variant="outline" className={cn(className, config.className)}>
      {config.label}
    </Badge>
  );
};

export const DepartmentBadge = ({ department, className }) => {
  if (!department) {
    const config = departmentConfig.default;
    return (
      <Badge
        variant="outline"
        className={cn('font-normal', className, config.className)}
      >
        {config.label}
      </Badge>
    );
  }

  const name = department.toLowerCase();
  const deptItem = DEPARTMENTS.find(
    (d) =>
      d.label.toLowerCase() === name ||
      d.value.toLowerCase() === name ||
      name.includes(d.value.toLowerCase())
  );

  const key = deptItem ? deptItem.value : 'default';
  const label =
    deptItem && deptItem.value !== 'default' ? deptItem.label : department;
  const config = departmentConfig[key] || departmentConfig.default;

  return (
    <Badge
      variant="outline"
      className={cn('font-normal', className, config.className)}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;

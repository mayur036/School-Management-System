import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted/60 text-muted-foreground border-muted',
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
  'half-day': {
    label: 'Half Day',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'on-leave': {
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
};

const StatusBadge = ({ status, className, pulse = false }) => {
  const normalizedStatus = status?.toLowerCase() || 'inactive';
  const config = statusConfig[normalizedStatus] || statusConfig.inactive;

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
          pulse && 'animate-pulse'
        )}
      />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;

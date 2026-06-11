import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const StatusBadge = ({ status, className, pulse = false }) => {
  const isActive = status === 'active';
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        isActive
          ? 'bg-success/10 text-success border-success/20'
          : 'bg-destructive/10 text-destructive border-destructive/20',
        className
      )}
    >
      <span
        className={cn(
          'mr-1.5 inline-block size-1.5 rounded-full bg-current',
          pulse && 'animate-pulse'
        )}
      />
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

export default StatusBadge;

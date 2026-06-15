import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';

const colors = [
  'bg-primary/10 text-primary border-primary/10',
  'bg-success/10 text-success border-success/10',
  'bg-info/10 text-info border-info/10',
  'bg-warning/10 text-warning border-warning/10',
  'bg-danger/10 text-danger border-danger/10',
];

const getColorClass = (name) => {
  if (!name) return colors[0];
  const charCodeSum = name
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base sm:h-16 sm:w-16 sm:text-lg',
};

export const UserAvatar = ({ name, avatarUrl, size = 'md', className }) => {
  const initials = getInitials(name || 'User');
  const colorClass = getColorClass(name || 'User');

  return (
    <Avatar className={cn('border', sizeMap[size], className)}>
      <AvatarImage src={avatarUrl} alt={name || 'User avatar'} />
      <AvatarFallback className={cn('font-semibold uppercase', colorClass)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

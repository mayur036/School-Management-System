import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatCard = ({
  Icon,
  label,
  value,
  subtext,
  iconChipClassName,
  valueClassName = 'text-base sm:text-2xl',
  subtextClassName = 'text-muted-foreground',
  className,
}) => (
  <Card className={cn('border-border bg-card border', className)}>
    <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-4 sm:p-4">
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-xl sm:size-10',
          iconChipClassName
        )}
      >
        <Icon className="size-4 sm:size-5" />
      </div>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-muted-foreground truncate text-[9px] font-semibold tracking-normal uppercase sm:text-xs sm:tracking-wider">
          {label}
        </span>
        <span
          className={cn(
            'text-foreground mt-0.5 truncate font-bold',
            valueClassName
          )}
        >
          {value}
        </span>
        {subtext != null && (
          <span
            className={cn(
              'mt-0.5 truncate text-[9px] sm:text-[10px]',
              subtextClassName
            )}
          >
            {subtext}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default StatCard;

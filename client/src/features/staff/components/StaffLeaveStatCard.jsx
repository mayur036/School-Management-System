import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STATS } from '@/lib/icons';

const StaffLeaveStatCard = ({ stats = {}, isLoading }) => {
  const items = [
    {
      label: 'Total Leaves',
      value: stats?.total ?? 0,
      Icon: STATS.TOTAL_LEAVES,
      subtext: 'Total leaves taken',
      accentClassName: 'border-blue-500',
      iconChipClassName: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Annual Leaves',
      value: stats?.annual_leaves ?? '18 / 18 days',
      Icon: STATS.ANNUAL_LEAVES,
      subtext: 'Annual leaves balance',
      accentClassName: 'border-yellow-500',
      iconChipClassName: 'bg-yellow-500/10 text-yellow-500',
    },
    {
      label: 'Casual Leaves',
      value: stats?.casual_leaves ?? '12 / 12 days',
      Icon: STATS.CASUAL_LEAVES,
      subtext: 'Casual leaves balance',
      accentClassName: 'border-orange-500',
      iconChipClassName: 'bg-orange-500/10 text-orange-500',
    },
    {
      label: 'Sick Leaves',
      value: stats?.sick_leaves ?? '12 / 12 days',
      Icon: STATS.SICK_LEAVES,
      subtext: 'Sick leaves balance',
      accentClassName: 'border-red-500',
      iconChipClassName: 'bg-red-500/10 text-red-500',
    },
  ];
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="border-border bg-card border-l-muted border border-l-4"
          >
            <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-4 sm:p-4">
              <Skeleton className="size-8 shrink-0 rounded-xl sm:size-10" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-2 w-16 sm:h-3 sm:w-20" />
                <Skeleton className="h-4 w-10 sm:h-6 sm:w-12" />
                <Skeleton className="hidden h-2 w-24 sm:block sm:h-2 sm:w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default StaffLeaveStatCard;

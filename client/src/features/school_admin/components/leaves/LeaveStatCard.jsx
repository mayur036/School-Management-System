import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STATS } from '@/lib/icons';

const LeaveStatCard = ({ stats, isLoading }) => {
  const items = [
    {
      label: 'Total Requests',
      value: stats?.total,
      subtext: 'All leave requests',
      Icon: STATS.TOTAL_LEAVES,
      iconChipClassName: 'bg-blue-500/10 text-blue-500',
      accentClassName: 'border-blue-500',
    },
    {
      label: 'Pending',
      value: stats?.pending,
      subtext: 'Awaiting review',
      Icon: STATS.PENDING_LEAVES,
      iconChipClassName: 'bg-amber-500/10 text-amber-500',
      accentClassName: 'border-amber-500',
    },
    {
      label: 'Approved',
      value: stats?.approved,
      subtext: 'Approved requests',
      Icon: STATS.APPROVED_LEAVES,
      iconChipClassName: 'bg-emerald-500/10 text-emerald-500',
      accentClassName: 'border-emerald-500',
    },
    {
      label: 'Rejected',
      value: stats?.rejected,
      subtext: 'Rejected requests',
      Icon: STATS.REJECTED_LEAVES,
      iconChipClassName: 'bg-rose-500/10 text-rose-500',
      accentClassName: 'border-rose-500',
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default LeaveStatCard;

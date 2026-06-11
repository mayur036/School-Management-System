import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE, STATS } from '@/lib/icons';

const DepartmentsStatCard = ({ stats, isLoading }) => {
  const items = [
    {
      label: 'Total Departments',
      value: stats?.total,
      subtext: 'All active departments',
      Icon: STATS.TOTAL_DEPARTMENTS,
      iconChipClassName: 'bg-purple-500/10 text-purple-500',
      accentClassName: 'border-purple-500',
    },
    {
      label: 'Total Staff',
      value: stats?.staff,
      subtext: 'Across all departments',
      Icon: STATS.TOTAL_STAFF,
      iconChipClassName: 'bg-emerald-500/10 text-emerald-500',
      accentClassName: 'border-emerald-500',
    },
    {
      label: 'Average Staff',
      value: stats?.avg,
      subtext: 'Per department',
      Icon: STATS.AVG_STAFF_PER_SCHOOL,
      iconChipClassName: 'bg-orange-500/10 text-orange-500',
      accentClassName: 'border-orange-500',
    },
    {
      label: 'Latest Added',
      value: stats?.latestName,
      subtext: stats?.latestDate,
      Icon: BASE.CALENDAR,
      iconChipClassName: 'bg-blue-500/10 text-blue-500',
      accentClassName: 'border-blue-500',
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

export default DepartmentsStatCard;

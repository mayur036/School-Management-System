import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STAFF, STATS } from '@/lib/icons';

const StaffAttendanceStatCard = ({ stats, isLoading }) => {
  const items = [
    {
      label: 'Working Hours',
      value: `${stats.totalHours ?? 0} hrs`,
      Icon: STAFF.TIME_LOG,
      subtext: 'This selected month',
      accentClassName: 'border-indigo-500',
      iconChipClassName: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      label: 'Present',
      value: stats.present,
      Icon: STATS.PRESENT,
      subtext: 'Days logged present',
      accentClassName: 'border-emerald-500',
      iconChipClassName: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      label: 'Half Day',
      value: stats.half_day,
      Icon: STAFF.TIME_LOG,
      subtext: 'Days logged half day',
      accentClassName: 'border-blue-500',
      iconChipClassName: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Late',
      value: stats.late,
      Icon: STATS.LATE,
      subtext: 'Days logged late',
      accentClassName: 'border-amber-500',
      iconChipClassName: 'bg-amber-500/10 text-amber-500',
    },
    {
      label: 'Absent',
      value: stats.absent,
      Icon: STATS.ABSENT,
      subtext: 'Days logged absent',
      accentClassName: 'border-rose-500',
      iconChipClassName: 'bg-rose-500/10 text-rose-500',
    },
    {
      label: 'On Leave',
      value: stats.leave,
      Icon: STATS.TOTAL_LEAVES,
      subtext: 'Days absent on leave',
      accentClassName: 'border-purple-500',
      iconChipClassName: 'bg-purple-500/10 text-purple-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default StaffAttendanceStatCard;

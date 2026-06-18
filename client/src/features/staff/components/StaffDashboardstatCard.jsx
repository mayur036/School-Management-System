import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { STAFF } from '@/lib/icons';

const StaffDashboardstatCard = ({ stats = {}, isLoading }) => {
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const items = [
    {
      label: 'Classes Today',
      value: stats?.today_classes ?? 0,
      Icon: STAFF.SUBJECTS,
      subtext: `Scheduled for ${dayName}`,
      accentClassName: 'border-blue-500',
      iconChipClassName: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Present Days',
      value: stats?.present_days ?? 0,
      Icon: STAFF.ATTENDANCE,
      subtext: 'This current month',
      accentClassName: 'border-emerald-500',
      iconChipClassName: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      label: 'Working Hours',
      value: `${stats?.total_work_hours ?? 0} hrs`,
      Icon: STAFF.TIME_LOG,
      subtext: 'This current month',
      accentClassName: 'border-indigo-500',
      iconChipClassName: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      label: 'Leaves Taken',
      value: stats?.leave_days ?? 0,
      Icon: STAFF.LEAVE_REQUEST,
      subtext: 'Days absent on leave',
      accentClassName: 'border-purple-500',
      iconChipClassName: 'bg-purple-500/10 text-purple-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border bg-card border">
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
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
};

export default StaffDashboardstatCard;

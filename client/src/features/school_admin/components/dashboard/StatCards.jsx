import StatCard from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';

// ── Card metadata: one entry per KPI tile ──────────────────────
const buildCards = (stats) => [
  {
    label: 'Departments',
    value: stats.deptsCount,
    subtext: 'Academic & Admin',
    Icon: SCHOOL_ADMIN.DEPARTMENTS,
    accentClassName: 'border-l-blue-500',
    iconChipClassName:
      'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    label: 'Total Staff',
    value: stats.total,
    subtext: 'All departments',
    Icon: SCHOOL_ADMIN.STAFF_LIST,
    accentClassName: 'border-l-emerald-500',
    iconChipClassName:
      'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    label: 'Active Staff',
    value: stats.active,
    subtext: `${stats.activePct}% of total`,
    subtextClassName: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    Icon: COMMON.CHECK,
    accentClassName: 'border-l-amber-500',
    iconChipClassName:
      'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  },
  {
    label: 'New This Month',
    value: stats.joinedThisMonth,
    subtext: 'Recently joined',
    Icon: SCHOOL_ADMIN.REGISTER_STAFF,
    accentClassName: 'border-l-purple-500',
    iconChipClassName:
      'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  },
];

const StatCards = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border bg-card border">
            <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-4 sm:p-4">
              <Skeleton className="size-8 shrink-0 rounded-xl sm:size-10" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {buildCards(stats).map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default StatCards;

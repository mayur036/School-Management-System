import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';

// ── Card metadata: one entry per KPI tile ──────────────────────
const buildCards = (stats) => [
  {
    label: 'Departments',
    value: stats.deptsCount,
    sub: 'Academic & Admin',
    Icon: SCHOOL_ADMIN.DEPARTMENTS,
    accent: 'border-l-blue-500',
    chip: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    label: 'Total Staff',
    value: stats.total,
    sub: 'All departments',
    Icon: SCHOOL_ADMIN.STAFF_LIST,
    accent: 'border-l-emerald-500',
    chip: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    label: 'Active Staff',
    value: stats.active,
    sub: `${stats.activePct}% of total`,
    subClass: 'text-emerald-600 dark:text-emerald-400 font-semibold',
    Icon: COMMON.CHECK,
    accent: 'border-l-amber-500',
    chip: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  },
  {
    label: 'New This Month',
    value: stats.joinedThisMonth,
    sub: 'Recently joined',
    Icon: SCHOOL_ADMIN.REGISTER_STAFF,
    accent: 'border-l-purple-500',
    chip: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
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
      {buildCards(stats).map(
        ({ label, value, sub, subClass, Icon, accent, chip }) => (
          <Card
            key={label}
            className={`border-border bg-card border border-l-4 ${accent}`}
          >
            <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-4 sm:p-4">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl sm:size-10 ${chip}`}
              >
                <Icon className="size-4 sm:size-5" />
              </div>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-muted-foreground truncate text-[9px] font-semibold tracking-normal uppercase sm:text-xs sm:tracking-wider">
                  {label}
                </span>
                <span className="text-foreground mt-0.5 truncate text-base font-bold sm:text-2xl">
                  {value}
                </span>
                <span
                  className={`mt-0.5 hidden truncate text-[9px] sm:block sm:text-[10px] ${
                    subClass ?? 'text-muted-foreground'
                  }`}
                >
                  {sub}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default StatCards;

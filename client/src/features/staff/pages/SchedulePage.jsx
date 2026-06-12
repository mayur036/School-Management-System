import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetStaffScheduleQuery } from '@/features/staff/staffActivity.api';
import { EMPTY_STATE } from '@/lib/icons';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const SchedulePage = () => {
  const { data, isLoading } = useGetStaffScheduleQuery();
  const schedule = data?.data?.schedule || [];

  // Group schedule items by day
  const groupedSchedule = DAYS.reduce((acc, day) => {
    acc[day] = schedule.filter((item) => item.day_of_week === day);
    return acc;
  }, {});

  const totalClasses = schedule.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            My Weekly Timetable
          </h1>
          <p className="text-muted-foreground text-sm">
            View your scheduled teaching periods and duty rotations
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground bg-muted/40 w-fit px-3.5 py-1"
        >
          {totalClasses} Scheduled Sessions
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((day) => (
            <Card key={day} className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : totalClasses > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((day) => {
            const sessions = groupedSchedule[day] || [];
            return (
              <Card
                key={day}
                className="border-border bg-card flex flex-col justify-between shadow-sm"
              >
                <div>
                  <CardHeader className="border-border bg-muted/30 rounded-t-lg border-b pb-3">
                    <CardTitle className="text-foreground flex items-center justify-between text-sm font-semibold">
                      <span>{day}</span>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground border-none text-[10px] font-normal"
                      >
                        {sessions.length} sessions
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {sessions.length > 0 ? (
                      sessions.map((session) => (
                        <div
                          key={session.schedule_id}
                          className="group hover:bg-muted/30 relative space-y-1 rounded-r-md border-l-2 border-blue-500 py-1 pl-3 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-foreground text-sm leading-tight font-semibold">
                              {session.subject_name}
                            </span>
                            <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[10px] font-medium">
                              {session.start_time.substring(0, 5)} -{' '}
                              {session.end_time.substring(0, 5)}
                            </span>
                          </div>
                          <div className="text-muted-foreground flex items-center justify-between text-xs">
                            <span>{session.class_name}</span>
                            {session.room && (
                              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                                Room {session.room}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <EMPTY_STATE.NO_DATA className="text-muted-foreground/30 mb-2 h-7 w-7" />
                        <span className="text-muted-foreground text-xs font-medium">
                          No Classes Scheduled
                        </span>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border-border mx-auto mt-6 flex max-w-xl flex-col items-center justify-center rounded-xl border py-20 text-center shadow-sm">
          <EMPTY_STATE.NO_DATA className="text-muted-foreground/20 mb-4 h-16 w-16" />
          <h2 className="text-foreground text-lg font-bold">
            No Timetable Configured
          </h2>
          <p className="text-muted-foreground mt-1 max-w-md px-6 text-sm">
            Your weekly schedule hasn't been set up yet by the administration.
            Please contact your school administrator to configure your periods.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;

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

const calculateTotalHours = (sessions) => {
  let totalMinutes = 0;
  sessions.forEach((s) => {
    const [startH, startM] = s.start_time.split(':').map(Number);
    const [endH, endM] = s.end_time.split(':').map(Number);
    totalMinutes += endH * 60 + endM - (startH * 60 + startM);
  });
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

const getSessionStatus = (session, day) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  if (day !== today) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = session.start_time.split(':').map(Number);
  const [endH, endM] = session.end_time.split(':').map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;

  if (currentMinutes >= startMins && currentMinutes <= endMins) {
    return 'current';
  } else if (currentMinutes < startMins) {
    return 'upcoming';
  }
  return 'completed';
};

export const SchedulePage = () => {
  const { data, isLoading } = useGetStaffScheduleQuery();
  const schedule = data?.data?.schedule || [];

  // Current day of the week to highlight
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Group schedule items by day
  const groupedSchedule = DAYS.reduce((acc, day) => {
    acc[day] = schedule.filter((item) => item.day_of_week === day);
    return acc;
  }, {});

  const totalClasses = schedule.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            My Weekly Timetable
          </h1>
          <p className="text-muted-foreground text-sm">
            View your scheduled teaching periods, timeslots, and classroom
            assignments.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-primary/20 text-primary bg-primary/5 w-fit px-3.5 py-1 text-xs font-semibold"
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
            const isToday = day === todayDay;
            const totalHours =
              sessions.length > 0 ? calculateTotalHours(sessions) : '0h';

            return (
              <Card
                key={day}
                className={`flex flex-col justify-between p-0 shadow-sm transition-all duration-300 ${
                  isToday
                    ? 'border-primary bg-primary/2 dark:bg-primary/2 ring-primary/20 scale-[1.01] ring-1'
                    : 'border-border bg-card'
                }`}
              >
                <div>
                  <CardHeader
                    className={`rounded-t-lg border-b py-3 ${
                      isToday
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <CardTitle className="text-foreground flex items-center justify-between text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{day}</span>
                        {isToday && (
                          <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground border-none text-[10px] font-normal"
                        >
                          {sessions.length} sessions
                        </Badge>
                        {sessions.length > 0 && (
                          <span className="text-muted-foreground font-mono text-[10px] leading-none">
                            ({totalHours})
                          </span>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 py-4">
                    {sessions.length > 0 ? (
                      sessions.map((session) => {
                        const status = getSessionStatus(session, day);
                        console.log(status);
                        return (
                          <div
                            key={session.schedule_id}
                            className={`group relative space-y-1 rounded-r-md border-l-2 py-1.5 px-2 transition-colors ${
                              status === 'current'
                                ? 'border-red-500 bg-red-500/5 dark:bg-red-950/10'
                                : status === 'upcoming'
                                  ? 'border-primary/50 bg-primary/2'
                                  : status === 'completed'
                                    ? 'border-green-500 bg-green-500/5 dark:bg-green-950/10'
                                    : 'hover:bg-muted/30 border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-col">
                                <span className="text-foreground text-sm leading-tight font-bold">
                                  {session.subject_name}
                                </span>
                                <span className="text-muted-foreground mt-0.5 text-[10px] leading-normal font-semibold">
                                  {session.period_name}
                                </span>
                              </div>
                              <div className="flex shrink-0 flex-col items-end gap-1">
                                <span className="text-muted-foreground font-mono text-[10px] leading-none font-medium">
                                  {session.start_time.substring(0, 5)} -{' '}
                                  {session.end_time.substring(0, 5)}
                                </span>
                                {status === 'current' ? (
                                  <Badge className="h-4 animate-pulse border-none bg-red-500 px-1 py-0 text-[8px] font-bold tracking-wider text-white uppercase">
                                    Live Now
                                  </Badge>
                                ) : status === 'upcoming' ? (
                                  <Badge
                                    variant="secondary"
                                    className="h-4 px-1 py-0 text-[8px] font-bold tracking-wider uppercase"
                                  >
                                    Next
                                  </Badge>
                                ) : status === 'completed' ? (
                                  <Badge
                                    variant="secondary"
                                    className="h-4 px-1 py-0 text-[8px] font-bold tracking-wider uppercase"
                                  >
                                    Completed
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                            <div className="text-muted-foreground flex items-center justify-between pt-0.5 text-xs">
                              <span className="font-semibold text-slate-600 dark:text-slate-400">
                                {session.class_name}
                              </span>
                              {session.room && (
                                <span className="rounded bg-slate-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-700 dark:text-slate-300">
                                  Room {session.room}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <EMPTY_STATE.NO_DATA className="text-muted-foreground/30 mb-2 h-7 w-7" />
                        <span className="text-muted-foreground text-xs font-semibold">
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

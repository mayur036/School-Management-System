import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useClockInOutMutation,
  useGetStaffAttendanceQuery,
  useGetStaffDashboardStatsQuery,
  useGetStaffScheduleQuery,
} from '@/features/staff/staffActivity.api';
import { useAuth } from '@/hooks/useAuth';
import { EMPTY_STATE, STAFF, STATUS } from '@/lib/icons';
import { getInitials } from '@/lib/utils';

const DynamicClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-1 text-center">
      <div className="text-foreground font-mono text-4xl font-bold tracking-tight">
        {time.toLocaleTimeString('en-US', { hour12: true })}
      </div>
      <div className="text-muted-foreground text-xs font-medium">
        {time.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </div>
  );
};

export const StaffDashboard = () => {
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // API Queries
  const { data: statsData, isLoading: isStatsLoading } =
    useGetStaffDashboardStatsQuery();
  const { data: scheduleData, isLoading: isScheduleLoading } =
    useGetStaffScheduleQuery();
  const { data: attendanceData, isLoading: isAttendanceLoading } =
    useGetStaffAttendanceQuery({
      startDate: todayStr,
      endDate: todayStr,
    });

  // API Mutations
  const [clockInOut, { isLoading: isClocking }] = useClockInOutMutation();

  // Dynamic clock has been isolated to prevent parent re-renders every second

  // Compute Clock Status
  const todayAttendance = attendanceData?.data?.attendance?.[0];
  const isClockedIn = !!todayAttendance?.clock_in;
  const isClockedOut = !!todayAttendance?.clock_out;

  console.log({ statsData, scheduleData, attendanceData });

  const handleClockAction = async () => {
    try {
      const res = await clockInOut().unwrap();
      toast.success(res.message || 'Time log recorded successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to record time log');
    }
  };

  // Filter schedule for today
  const todayClasses =
    scheduleData?.data?.schedule?.filter((s) => s.day_of_week === dayName) ||
    [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-white/10 text-lg font-semibold text-white">
                {getInitials(`${user?.first_name} ${user?.last_name || ''}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">
                {user?.department_name || 'Staff Member'} ·{' '}
                {user?.role_name === 'staff'
                  ? 'Departmental Staff'
                  : user?.role_name}
              </p>
            </div>
          </div>
          <Badge className="border-none bg-white/20 px-3 py-1.5 font-medium text-white backdrop-blur-md">
            {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
          </Badge>
        </div>
        <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Time Clock Widget */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-sm md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <STAFF.TIME_LOG className="h-5 w-5 text-indigo-500" />
              Attendance Clock
            </CardTitle>
            <CardDescription>Log your daily working hours</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center space-y-6 py-4">
            <DynamicClock />

            <div className="border-border bg-muted/40 space-y-1 rounded-lg border p-3.5 text-center">
              {isAttendanceLoading ? (
                <Skeleton className="mx-auto h-5 w-3/4" />
              ) : isClockedOut ? (
                <div className="flex flex-col items-center gap-1">
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground border-none"
                  >
                    Shift Ended
                  </Badge>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Clock In: {todayAttendance.clock_in} · Clock Out:{' '}
                    {todayAttendance.clock_out}
                  </p>
                </div>
              ) : isClockedIn ? (
                <div className="flex flex-col items-center gap-1">
                  <Badge className="border-none bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active Shift
                  </Badge>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Clocked in at {todayAttendance.clock_in}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    Not Clocked In
                  </Badge>
                  <p className="text-muted-foreground/85 mt-1 text-xs">
                    Ready to start your workday
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button
              className="w-full font-semibold"
              variant={isClockedIn && !isClockedOut ? 'destructive' : 'default'}
              disabled={isClockedOut || isAttendanceLoading || isClocking}
              onClick={handleClockAction}
            >
              {isClocking ? (
                'Syncing...'
              ) : isClockedOut ? (
                'Shift Complete'
              ) : isClockedIn ? (
                <>
                  <STAFF.LOGOUT className="mr-2 h-4 w-4" /> Clock Out
                </>
              ) : (
                <>
                  <STATUS.ACTIVE className="mr-2 h-4 w-4" /> Clock In
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:grid-cols-4">
          {/* Today's classes */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Classes Today
              </CardTitle>
              <div className="rounded-full bg-blue-500/10 p-2">
                <STAFF.SUBJECTS className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-foreground text-2xl font-bold">
                  {statsData?.data?.stats?.today_classes ?? 0}
                </div>
              )}
              <p className="text-muted-foreground mt-1 text-[10px]">
                Scheduled for {dayName}
              </p>
            </CardContent>
          </Card>

          {/* Present Days */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Present Days
              </CardTitle>
              <div className="rounded-full bg-emerald-500/10 p-2">
                <STAFF.ATTENDANCE className="h-4 w-4 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-foreground text-2xl font-bold">
                  {statsData?.data?.stats?.present_days ?? 0}
                </div>
              )}
              <p className="text-muted-foreground mt-1 text-[10px]">
                This current month
              </p>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Working Hours
              </CardTitle>
              <div className="rounded-full bg-indigo-500/10 p-2">
                <STAFF.TIME_LOG className="h-4 w-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-foreground text-2xl font-bold">
                  {statsData?.data?.stats?.total_work_hours ?? 0} hrs
                </div>
              )}
              <p className="text-muted-foreground mt-1 text-[10px]">
                This current month
              </p>
            </CardContent>
          </Card>

          {/* Leaves Taken */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Leaves Taken
              </CardTitle>
              <div className="rounded-full bg-purple-500/10 p-2">
                <STAFF.LEAVE_REQUEST className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              {isStatsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-foreground text-2xl font-bold">
                  {statsData?.data?.stats?.leave_days ?? 0}
                </div>
              )}
              <p className="text-muted-foreground mt-1 text-[10px]">
                Days absent on leave
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-3xl">
        {/* Today's Timetable */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="border-border border-b pb-3">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              <span className="flex items-center gap-2">
                <STAFF.SCHEDULE className="h-4 w-4 text-blue-500" />
                Today's Timetable
              </span>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground text-xs font-normal"
              >
                {todayClasses.length} sessions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {isScheduleLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : todayClasses.length > 0 ? (
              <div className="border-border relative space-y-5 border-l py-1 pl-4">
                {todayClasses.map((item) => (
                  <div key={item.schedule_id} className="group relative">
                    {/* Bullet indicator */}
                    <div className="border-card bg-primary absolute top-1.5 -left-5.25 h-3.5 w-3.5 rounded-full border-2 shadow-sm transition-transform group-hover:scale-110" />

                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-semibold">
                          {item.subject_name}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {item.class_name} · Room {item.room || 'N/A'}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground border-none font-mono text-[10px]"
                      >
                        {item.start_time.substring(0, 5)} -{' '}
                        {item.end_time.substring(0, 5)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
                <h3 className="text-foreground text-sm font-semibold">
                  No Classes Today
                </h3>
                <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                  You have no teaching or duty sessions scheduled for today.
                  Enjoy!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;

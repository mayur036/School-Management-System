import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import WelcomeBanner from '@/components/shared/WelcomeBanner';
import { Badge } from '@/components/ui/badge';
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
import { BASE, STAFF } from '@/lib/icons';
import { cn } from '@/lib/utils';

import DynamicClock from '../components/DynamicClock';
import StaffDashboardstatCard from '../components/StaffDashboardstatCard';

export const StaffDashboard = () => {
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

  // Compute Clock Status
  const todayAttendance = attendanceData?.data?.attendance?.[0];
  const isClockedIn = !!todayAttendance?.clock_in;
  const isClockedOut = !!todayAttendance?.clock_out;

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
      <WelcomeBanner />

      {/* Stats Cards (Full-width row) */}
      <StaffDashboardstatCard
        stats={statsData?.data?.stats}
        isLoading={isStatsLoading}
      />

      {/* Clock and Timetable row (50/50 Grid) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Attendance Clock Card */}
        <Card className="bg-card flex flex-col justify-between border-indigo-100 shadow-sm dark:border-indigo-950/40">
          <CardHeader className="flex flex-row items-center gap-3 border-b border-indigo-50/50 pb-3 dark:border-indigo-950/20">
            <div className="bg-indigo-650 flex size-9 items-center justify-center rounded-xl text-white">
              <BASE.CLOCK className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Attendance Clock
              </CardTitle>
              <CardDescription>Log your daily working hours</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center py-4">
            <DynamicClock
              todayAttendance={todayAttendance}
              isClockedIn={isClockedIn}
              isClockedOut={isClockedOut}
              isAttendanceLoading={isAttendanceLoading}
              isClocking={isClocking}
              handleClockAction={handleClockAction}
            />
          </CardContent>
        </Card>

        {/* Today's Timetable Card */}
        <Card className="border-border bg-card flex flex-col justify-between shadow-sm">
          <CardHeader className="border-border border-b pb-3">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              <span className="flex items-center gap-2">
                <STAFF.SCHEDULE className="text-primary h-4 w-4" />
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
          <CardContent className="flex flex-1 flex-col justify-center pt-4">
            {isScheduleLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : todayClasses.length > 0 ? (
              <div className="border-border relative my-2 space-y-5 border-l py-1 pl-4">
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
                          {item.class_name} · {item.period_name}{' '}
                          {item.room ? `· Room ${item.room}` : ''}
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
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full border border-blue-100/30 bg-blue-50/50 text-blue-500 dark:border-blue-950/30 dark:bg-blue-950/20">
                  <STAFF.SCHEDULE className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-foreground text-base font-bold">
                  No classes scheduled for today
                </h3>
                <p className="text-muted-foreground mt-1 max-w-72 text-xs leading-relaxed">
                  Enjoy your free time or prepare for upcoming classes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section (Full width) */}
      <div className="space-y-3.5">
        <h2 className="text-foreground text-base font-bold tracking-tight">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'View My Schedule',
              desc: 'See your upcoming classes',
              to: '/staff/schedule',
              Icon: STAFF.SCHEDULE,
              iconClass: 'bg-blue-500/10 text-blue-500',
            },
            {
              title: 'Apply for Leave',
              desc: 'Submit leave requests',
              to: '/staff/attendance',
              Icon: STAFF.LEAVE_REQUEST,
              iconClass: 'bg-emerald-500/10 text-emerald-500',
            },
            {
              title: 'Attendance Records',
              desc: 'View attendance history',
              to: '/staff/attendance',
              Icon: STAFF.ATTENDANCE,
              iconClass: 'bg-indigo-500/10 text-indigo-500',
            },
            {
              title: 'Update Profile',
              desc: 'Manage your profile',
              to: '/staff/profile',
              Icon: STAFF.PROFILE,
              iconClass: 'bg-purple-500/10 text-purple-500',
            },
          ].map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="bg-card border-border hover:bg-muted/30 group flex cursor-pointer items-center gap-4 rounded-xl border p-4.5 shadow-xs transition-all duration-200"
            >
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                  action.iconClass
                )}
              >
                <action.Icon className="size-5" />
              </div>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-foreground group-hover:text-primary text-sm font-semibold tracking-tight transition-colors">
                  {action.title}
                </span>
                <span className="text-muted-foreground mt-0.5 truncate text-[11px]">
                  {action.desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

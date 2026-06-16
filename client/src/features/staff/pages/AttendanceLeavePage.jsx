import { useMemo, useState } from 'react';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetStaffAttendanceQuery,
  useGetStaffLeavesQuery,
} from '@/features/staff/staffActivity.api';
import { ACTIONS, EMPTY_STATE, STAFF } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

import LeaveRequestDialog from '../components/LeaveRequestDialog';
import StaffAttendanceStatCard from '../components/StaffAttendanceStatCard';
import StaffLeaveStatCard from '../components/StaffLeaveStatCard';
import {
  ATTENDANCE_COLUMNS,
  LEAVE_COLUMNS,
  MONTHS,
} from '../constants/staffActivity.constants';
import {
  computeStaffAttendanceStats,
  computeStaffLeavesStats,
} from '../utils/staffActivity.utils';

const formatDuration = (durationStr) => {
  if (!durationStr) return '-';
  const parts = durationStr.split(':');
  if (parts.length < 2) return durationStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (hours === 0 && minutes === 0) return '-';
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const AttendanceLeavePage = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [isOpen, setIsOpen] = useState(false);

  // Month selector state for Attendance
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Compute start/end date for selected month
  const startDate = new Date(Number(selectedYear), Number(selectedMonth), 1)
    .toISOString()
    .split('T')[0];
  const endDate = new Date(Number(selectedYear), Number(selectedMonth) + 1, 0)
    .toISOString()
    .split('T')[0];

  // Queries
  const { data: attendanceData, isLoading: isAttendanceLoading } =
    useGetStaffAttendanceQuery({
      startDate,
      endDate,
    });
  const { data: leavesData, isLoading: isLeavesLoading } =
    useGetStaffLeavesQuery(undefined, { pollingInterval: 30000 });

  const attendance = useMemo(
    () => attendanceData?.data?.attendance || [],
    [attendanceData]
  );
  const leaves = useMemo(() => leavesData?.data?.leaves || [], [leavesData]);

  const leaveStats = useMemo(
    () => computeStaffLeavesStats(leaves, attendance),
    [leaves, attendance]
  );

  const attendanceStats = useMemo(
    () => computeStaffAttendanceStats(attendance),
    [attendance]
  );

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'Staff', to: '/staff/dashboard' },
          { label: 'Attendance & Leaves' },
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Attendance & Leaves
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor your monthly attendance logs and apply for leave time.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="border-border bg-muted/60 rounded-md border p-1 shadow-sm">
          <TabsTrigger
            value="attendance"
            className="group data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-sm px-4 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
          >
            <STAFF.ATTENDANCE className="mr-2 h-3.5 w-3.5" />
            Attendance
            <span className="ml-1.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white dark:text-blue-400">
              {attendance.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="leaves"
            className="group data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-sm px-4 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
          >
            <STAFF.LEAVE_REQUEST className="mr-2 h-3.5 w-3.5" />
            Leave Requests
            <span className="ml-1.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white dark:text-blue-400">
              {leaves.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Attendance Logs */}
        <TabsContent value="attendance" className="space-y-4">
          {/* Attendance Stats */}
          <StaffAttendanceStatCard
            stats={attendanceStats}
            isLoading={isAttendanceLoading}
          />

          {/* Attendance History Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="border-border flex flex-col gap-4 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  Time Logs
                </CardTitle>
                <CardDescription>
                  Historical overview of your clock-ins and clock-outs
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-35 text-xs">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem
                        key={m.value}
                        value={m.value}
                        className="text-xs"
                      >
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-25 text-xs">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={currentYear} className="text-xs">
                      {currentYear}
                    </SelectItem>
                    <SelectItem value={currentYear - 1} className="text-xs">
                      {currentYear - 1}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isAttendanceLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : attendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        {ATTENDANCE_COLUMNS.map((col) => (
                          <TableHead
                            key={col.label}
                            className="text-muted-foreground text-xs font-semibold"
                          >
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((row) => (
                        <TableRow
                          key={row.attendance_id}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-foreground text-xs font-medium">
                            {formatDate(row.date, 'medium')}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {row.clock_in ? row.clock_in.substring(0, 5) : '-'}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {row.clock_out
                              ? row.clock_out.substring(0, 5)
                              : '-'}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {formatDuration(row.work_duration)}
                          </TableCell>
                          <TableCell className="text-xs">
                            <StatusBadge status={row.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyTableState
                  title="No Logs"
                  description="No attendance or time clock records found for the selected month."
                  icon={EMPTY_STATE.NO_DATA}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Leaves Management */}
        <TabsContent value="leaves" className="space-y-6">
          {/* Leave Balances Grid */}
          <StaffLeaveStatCard stats={leaveStats} isLoading={isLeavesLoading} />

          {/* Leave History Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="border-border flex flex-col gap-4 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-foreground text-lg font-semibold">
                  Leave History
                </CardTitle>
                <CardDescription>
                  Track the status of your submitted leave applications
                </CardDescription>
              </div>

              {/* Apply Leave Action Button */}
              <Button
                className="h-auto py-1.5 text-xs font-semibold"
                onClick={() => setIsOpen(true)}
              >
                <ACTIONS.CREATE className="mr-2 h-4 w-4" /> Apply for Leave
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {isLeavesLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : leaves.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        {LEAVE_COLUMNS.map((col) => (
                          <TableHead
                            key={col.label}
                            className="text-muted-foreground text-xs font-semibold"
                          >
                            {col.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaves.map((leave) => (
                        <TableRow
                          key={leave.leave_id}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-foreground text-xs font-semibold">
                            {leave.leave_type}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {formatDate(leave.start_date, 'medium')}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {formatDate(leave.end_date, 'medium')}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs font-medium">
                            {leave.total_days}{' '}
                            {leave.total_days === 1 ? 'day' : 'days'}
                          </TableCell>
                          <TableCell
                            className="text-muted-foreground max-w-50 truncate text-xs"
                            title={leave.reason}
                          >
                            {leave.reason}
                          </TableCell>
                          <TableCell className="text-xs">
                            <StatusBadge status={leave.status} />
                          </TableCell>
                          <TableCell
                            className="text-muted-foreground max-w-37.5 truncate text-xs italic"
                            title={leave.comments || ''}
                          >
                            {leave.comments || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyTableState
                  title="No Leave History"
                  description="You haven't submitted any leave applications yet."
                  icon={EMPTY_STATE.NO_DATA}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Leave Request Dialog Component */}
      <LeaveRequestDialog open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default AttendanceLeavePage;

import { useMemo, useState } from 'react';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
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
import {
  ATTENDANCE_COLUMNS,
  LEAVE_COLUMNS,
  MONTHS,
} from '../constants/staffActivity.constants';

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

// Skeleton rows (loading state)
const AttendanceSkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i} className="hover:bg-transparent border-b transition-colors last:border-0">
      <TableCell className="py-3">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-16 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-16 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-20 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
      </TableCell>
    </TableRow>
  ));

const LeaveSkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i} className="hover:bg-transparent border-b transition-colors last:border-0">
      <TableCell className="py-3">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-12 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-40 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
    </TableRow>
  ));

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

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'Staff', to: '/staff/dashboard' },
          { label: 'Attendance & Leaves' },
        ]}
      />

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
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="border-border border-b p-4.5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-foreground text-sm font-bold tracking-tight">
                    Time Logs
                  </h3>
                  <p className="text-muted-foreground text-xs font-medium mt-0.5">
                    Historical overview of your clock-ins and clock-outs
                  </p>
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
              </div>
            </div>
            
            {isAttendanceLoading ? (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
                    {ATTENDANCE_COLUMNS.map((col) => (
                      <TableHead
                        key={col.label}
                        className="h-11 py-3 text-left"
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AttendanceSkeletonRows />
                </TableBody>
              </Table>
            ) : attendance.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
                      {ATTENDANCE_COLUMNS.map((col) => (
                        <TableHead
                          key={col.label}
                          className="h-11 py-3 text-left"
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
                        className="hover:bg-muted/10 border-b transition-colors last:border-0"
                      >
                        <TableCell className="text-foreground py-3.5 text-xs font-semibold">
                          {formatDate(row.date, 'medium')}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 font-mono text-xs font-medium">
                          {row.clock_in ? row.clock_in.substring(0, 5) : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 font-mono text-xs font-medium">
                          {row.clock_out
                            ? row.clock_out.substring(0, 5)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                          {formatDuration(row.work_duration)}
                        </TableCell>
                        <TableCell className="py-3.5 text-xs">
                          <StatusBadge status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-6">
                <EmptyTableState
                  title="No Logs"
                  description="No attendance or time clock records found for the selected month."
                  icon={EMPTY_STATE.NO_DATA}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Leaves Management */}
        <TabsContent value="leaves" className="space-y-6">
          <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="border-border border-b p-4.5 bg-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-foreground text-sm font-bold tracking-tight">
                    Leave History
                  </h3>
                  <p className="text-muted-foreground text-xs font-medium mt-0.5">
                    Track the status of your submitted leave applications
                  </p>
                </div>

                {/* Apply Leave Action Button */}
                <Button
                  onClick={() => setIsOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-9 px-4 text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <ACTIONS.CREATE className="mr-2 size-4" /> Apply for Leave
                </Button>
              </div>
            </div>
            
            {isLeavesLoading ? (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
                    {LEAVE_COLUMNS.map((col) => (
                      <TableHead
                        key={col.label}
                        className="h-11 py-3 text-left"
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <LeaveSkeletonRows />
                </TableBody>
              </Table>
            ) : leaves.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
                      {LEAVE_COLUMNS.map((col) => (
                        <TableHead
                          key={col.label}
                          className="h-11 py-3 text-left"
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
                        className="hover:bg-muted/10 border-b transition-colors last:border-0"
                      >
                        <TableCell className="text-foreground py-3.5 text-xs font-semibold">
                          {leave.leave_type}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                          {formatDate(leave.start_date, 'medium')}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                          {formatDate(leave.end_date, 'medium')}
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                          {leave.total_days}{' '}
                          {leave.total_days === 1 ? 'day' : 'days'}
                        </TableCell>
                        <TableCell
                          className="text-muted-foreground max-w-50 truncate py-3.5 text-xs font-medium"
                          title={leave.reason}
                        >
                          {leave.reason}
                        </TableCell>
                        <TableCell className="py-3.5 text-xs">
                          <StatusBadge status={leave.status} />
                        </TableCell>
                        <TableCell
                          className="text-muted-foreground max-w-37.5 truncate py-3.5 text-xs font-medium italic"
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
              <div className="p-6">
                <EmptyTableState
                  title="No Leave History"
                  description="You haven't submitted any leave applications yet."
                  icon={EMPTY_STATE.NO_DATA}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Leave Request Dialog Component */}
      <LeaveRequestDialog open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default AttendanceLeavePage;

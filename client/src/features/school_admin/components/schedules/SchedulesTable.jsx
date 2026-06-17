import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useDeleteStaffScheduleMutation,
  useListSchoolSchedulesQuery,
} from '@/features/school_admin/schedule.api';
import { ACTIONS, EMPTY_STATE } from '@/lib/icons';

// Skeleton rows (loading state)
const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow
      key={i}
      className="border-b transition-colors last:border-0 hover:bg-transparent"
    >
      <TableCell className="py-3">
        <Skeleton className="h-4 w-32 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-16 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-36 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="h-8 w-8 animate-pulse rounded-lg" />
          <Skeleton className="h-8 w-8 animate-pulse rounded-lg" />
        </div>
      </TableCell>
    </TableRow>
  ));

export const SchedulesTable = ({ search = '', staffFilter = 'all', dayFilter = 'all', onEdit }) => {
  const { data: schedulesData, isLoading } = useListSchoolSchedulesQuery();
  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteStaffScheduleMutation();

  const filteredSchedules = useMemo(() => {
    const schedules = schedulesData?.data?.schedules || [];
    return schedules.filter((item) => {
      const matchesSearch =
        item.subject_name.toLowerCase().includes(search.toLowerCase()) ||
        item.class_name.toLowerCase().includes(search.toLowerCase()) ||
        (item.room && item.room.toLowerCase().includes(search.toLowerCase()));

      const matchesStaff =
        staffFilter === 'all' || item.staff_id === Number(staffFilter);

      const matchesDay =
        dayFilter === 'all' || item.day_of_week === dayFilter;

      return matchesSearch && matchesStaff && matchesDay;
    });
  }, [schedulesData, search, staffFilter, dayFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule entry?'))
      return;
    try {
      await deleteSchedule(id).unwrap();
      toast.success('Schedule entry deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete schedule entry');
    }
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-left">Staff Member</TableHead>
            <TableHead className="h-11 py-3 text-left">Department</TableHead>
            <TableHead className="h-11 py-3 text-left">Subject</TableHead>
            <TableHead className="h-11 py-3 text-left">Class / Room</TableHead>
            <TableHead className="h-11 py-3 text-left">Day</TableHead>
            <TableHead className="h-11 py-3 text-left">Time Period</TableHead>
            <TableHead className="h-11 w-24 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonRows />
        </TableBody>
      </Table>
    );
  }

  if (filteredSchedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
        <h3 className="text-foreground text-sm font-semibold">
          No Schedule Entries Found
        </h3>
        <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
          Try modifying your search or filter values to find records.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-left">Staff Member</TableHead>
            <TableHead className="h-11 py-3 text-left">Department</TableHead>
            <TableHead className="h-11 py-3 text-left">Subject</TableHead>
            <TableHead className="h-11 py-3 text-left">Class / Room</TableHead>
            <TableHead className="h-11 py-3 text-left">Day</TableHead>
            <TableHead className="h-11 py-3 text-left">Time Period</TableHead>
            <TableHead className="h-11 w-24 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchedules.map((item) => (
            <TableRow
              key={item.schedule_id}
              className="hover:bg-muted/10 border-b transition-colors last:border-0"
            >
              <TableCell className="text-foreground py-3.5 text-xs font-semibold">
                {item.staff_name}
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                {item.department_name || 'Staff'}
              </TableCell>
              <TableCell className="text-foreground py-3.5 text-xs font-semibold">
                {item.subject_name}
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                {item.class_name}{' '}
                {item.room ? `· Room ${item.room}` : ''}
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 text-xs font-medium">
                {item.day_of_week}
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 font-mono text-xs font-medium">
                {item.period_name} ({item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)})
              </TableCell>
              <TableCell className="py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                    onClick={() => onEdit?.(item)}
                    title="Edit Slot"
                  >
                    <ACTIONS.EDIT className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive size-8 cursor-pointer rounded-lg"
                    disabled={isDeleting}
                    onClick={() => handleDelete(item.schedule_id)}
                    title="Delete Slot"
                  >
                    <ACTIONS.DELETE className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SchedulesTable;

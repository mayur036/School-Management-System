import { useEffect, useState } from 'react';
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
import { ACTIONS, BASE, EMPTY_STATE } from '@/lib/icons';

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
  // Local debounced search & sorting states
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sortBy, setSortBy] = useState('staff_name');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Query schedules from server with parameters
  const { data: schedulesData, isLoading } = useListSchoolSchedulesQuery({
    search: debouncedSearch,
    staff_id: staffFilter === 'all' ? 0 : Number(staffFilter),
    day_of_week: dayFilter === 'all' ? '' : dayFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteStaffScheduleMutation();

  const schedules = schedulesData?.data?.schedules || [];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

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

  const renderSortChevron = (column) => {
    if (sortBy !== column) {
      return <BASE.CHEVRON_SORT className="size-3 text-muted-foreground/55" />;
    }
    return sortOrder === 'ASC' ? (
      <BASE.CHEVRON_UP className="size-3" />
    ) : (
      <BASE.CHEVRON_DOWN className="size-3" />
    );
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

  if (schedules.length === 0) {
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
            {/* Staff Member Header */}
            <TableHead
              className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
              onClick={() => handleSort('staff_name')}
            >
              <div className="flex items-center gap-1">
                Staff Member
                {renderSortChevron('staff_name')}
              </div>
            </TableHead>

            {/* Department Header */}
            <TableHead className="h-11 py-3 text-left">Department</TableHead>

            {/* Subject Header */}
            <TableHead
              className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
              onClick={() => handleSort('subject_name')}
            >
              <div className="flex items-center gap-1">
                Subject
                {renderSortChevron('subject_name')}
              </div>
            </TableHead>

            {/* Class / Room Header */}
            <TableHead
              className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
              onClick={() => handleSort('class_name')}
            >
              <div className="flex items-center gap-1">
                Class / Room
                {renderSortChevron('class_name')}
              </div>
            </TableHead>

            {/* Day Header */}
            <TableHead
              className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
              onClick={() => handleSort('day_of_week')}
            >
              <div className="flex items-center gap-1">
                Day
                {renderSortChevron('day_of_week')}
              </div>
            </TableHead>

            <TableHead className="h-11 py-3 text-left">Time Period</TableHead>
            <TableHead className="h-11 w-24 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((item) => (
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

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
  useDeleteSchoolPeriodMutation,
  useGetSchoolPeriodsQuery,
} from '@/features/school_admin/schedule.api';
import { ACTIONS, EMPTY_STATE } from '@/lib/icons';

// Skeleton rows (loading state)
const SkeletonRows = ({ count = 3 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i} className="hover:bg-transparent border-b transition-colors last:border-0">
      <TableCell className="py-3 text-center">
        <Skeleton className="mx-auto h-4 w-8 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-16 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-16 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-center">
        <Skeleton className="mx-auto h-5 w-16 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="h-8 w-8 rounded-lg animate-pulse" />
          <Skeleton className="h-8 w-8 rounded-lg animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  ));

export const PeriodsTable = ({ onEdit }) => {
  const { data: periodsData, isLoading } = useGetSchoolPeriodsQuery();
  const [deletePeriod, { isLoading: isDeleting }] = useDeleteSchoolPeriodMutation();

  const periods = periodsData?.data?.periods || [];

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this period? This will fail if schedules reference it.'
      )
    ) {
      return;
    }
    try {
      const res = await deletePeriod(id).unwrap();
      toast.success(res.message || 'Period deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete period');
    }
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-center w-16">Order</TableHead>
            <TableHead className="h-11 py-3 text-left">Name</TableHead>
            <TableHead className="h-11 py-3 text-left">Start Time</TableHead>
            <TableHead className="h-11 py-3 text-left">End Time</TableHead>
            <TableHead className="h-11 py-3 text-center w-24">Type</TableHead>
            <TableHead className="h-11 py-3 text-right w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonRows />
        </TableBody>
      </Table>
    );
  }

  if (periods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
        <h3 className="text-foreground text-sm font-semibold">
          No Periods Set
        </h3>
        <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
          Get started by defining your school schedule periods.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-center w-16">
              Order
            </TableHead>
            <TableHead className="h-11 py-3 text-left">Name</TableHead>
            <TableHead className="h-11 py-3 text-left">
              Start Time
            </TableHead>
            <TableHead className="h-11 py-3 text-left">
              End Time
            </TableHead>
            <TableHead className="h-11 py-3 text-center w-24">
              Type
            </TableHead>
            <TableHead className="h-11 py-3 text-right w-24">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periods.map((period) => (
            <TableRow
              key={period.period_id}
              className="hover:bg-muted/10 border-b transition-colors last:border-0"
            >
              <TableCell className="text-center font-mono py-3.5 text-xs font-medium">
                {period.period_order}
              </TableCell>
              <TableCell className="text-foreground py-3.5 text-xs font-semibold">
                {period.period_name}
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 font-mono text-xs font-medium">
                {period.start_time.substring(0, 5)}
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 font-mono text-xs font-medium">
                {period.end_time.substring(0, 5)}
              </TableCell>
              <TableCell className="py-3.5 text-center text-xs">
                {period.is_break ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-950/35 dark:text-amber-300">
                    Break
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-950/35 dark:text-blue-300">
                    Class
                  </span>
                )}
              </TableCell>
              <TableCell className="py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                    onClick={() => onEdit?.(period)}
                    title="Edit Period"
                  >
                    <ACTIONS.EDIT className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive size-8 cursor-pointer rounded-lg"
                    disabled={isDeleting}
                    onClick={() => handleDelete(period.period_id)}
                    title="Delete Period"
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

export default PeriodsTable;

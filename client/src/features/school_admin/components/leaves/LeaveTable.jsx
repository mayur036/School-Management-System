import EmptyTableState from '@/components/shared/EmptyTableState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { EMPTY_STATE } from '@/lib/icons';
import { formatDate, getInitials } from '@/lib/utils';

// ── Status badge color map ────────────────────────────────────
const statusConfig = {
  approved: {
    className:
      'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  rejected: {
    className:
      'bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500',
  },
  pending: {
    className:
      'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
};

// ── Skeleton Loading Rows ─────────────────────────────────────
const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-8" />
      </TableCell>
    </TableRow>
  ));

// ── Main Table Component ──────────────────────────────────────
const LeaveTable = ({ leaves, isLoading, onReview }) => {
  if (isLoading) {
    return (
      <div className="bg-card overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Duration</TableHead>
              <TableHead className="hidden xl:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!leaves?.length) {
    return (
      <EmptyTableState
        icon={EMPTY_STATE.NO_DATA}
        title="No leave requests found"
        description="Try adjusting your filters, search terms, or wait for staff to submit leave applications."
      />
    );
  }

  return (
    <div className="bg-card overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="hidden lg:table-cell">Duration</TableHead>
            <TableHead className="hidden xl:table-cell">Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => {
            const config = statusConfig[leave.status] || statusConfig.pending;
            const initials = getInitials({
              first_name: leave.first_name,
              last_name: leave.last_name,
            });

            return (
              <TableRow key={leave.leave_id}>
                {/* Staff Member */}
                <TableCell className="flex items-center gap-3">
                  <Avatar className="border-border size-9 border">
                    <AvatarImage src={leave.avatar_url} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                      {initials || 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium">
                      {leave.first_name} {leave.last_name || ''}
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[10px]">
                      {leave.email}
                    </span>
                  </div>
                </TableCell>

                {/* Leave Type */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-border font-normal"
                  >
                    {leave.leave_type}
                  </Badge>
                </TableCell>

                {/* Department */}
                <TableCell className="text-muted-foreground hidden text-xs md:table-cell">
                  {leave.department_name || 'Staff'}
                </TableCell>

                {/* Duration */}
                <TableCell className="hidden lg:table-cell">
                  <div className="text-foreground text-xs font-medium">
                    {formatDate(leave.start_date, 'medium')} –{' '}
                    {formatDate(leave.end_date, 'medium')}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[10px] font-semibold">
                    {leave.total_days} {leave.total_days === 1 ? 'day' : 'days'}
                  </div>
                </TableCell>

                {/* Reason */}
                <TableCell
                  className="text-muted-foreground hidden max-w-40 truncate text-xs xl:table-cell"
                  title={leave.reason}
                >
                  {leave.reason}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    className={`flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${config.className}`}
                  >
                    <span className={`size-1.5 rounded-full ${config.dot}`} />
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                  </Badge>
                </TableCell>

                <TableCell>
                  {leave.status === 'pending' && (
                    <Button
                      size="sm"
                      className="h-7 cursor-pointer px-3 text-[11px] font-semibold"
                      onClick={() => onReview(leave)}
                    >
                      Review
                    </Button>
                  )}
                  {leave.status !== 'pending' && (
                    <span className="text-muted-foreground text-[11px] font-medium">
                      Completed
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveTable;

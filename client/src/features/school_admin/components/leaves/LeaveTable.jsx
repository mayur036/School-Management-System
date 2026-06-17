import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge, { LeaveTypeBadge } from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

// ── Skeleton Loading Rows ─────────────────────────────────────
const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i} className="hover:bg-transparent border-b transition-colors last:border-0">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28 animate-pulse" />
            <Skeleton className="h-3 w-20 animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-20 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 hidden md:table-cell">
        <Skeleton className="h-4 w-20 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 hidden lg:table-cell">
        <Skeleton className="h-4 w-32 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 hidden xl:table-cell">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <Skeleton className="ml-auto h-7 w-14 rounded-lg animate-pulse" />
      </TableCell>
    </TableRow>
  ));

// ── Main Table Component ──────────────────────────────────────
const LeaveTable = ({ leaves, isLoading, onReview }) => {
  if (isLoading) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
              <TableHead className="h-11 py-3 text-left">Staff Member</TableHead>
              <TableHead className="h-11 py-3 text-left">Leave Type</TableHead>
              <TableHead className="h-11 py-3 text-left hidden md:table-cell">Department</TableHead>
              <TableHead className="h-11 py-3 text-left hidden lg:table-cell">Duration</TableHead>
              <TableHead className="h-11 py-3 text-left hidden xl:table-cell">Reason</TableHead>
              <TableHead className="h-11 py-3 text-left">Status</TableHead>
              <TableHead className="h-11 py-3 text-right w-16">Actions</TableHead>
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
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-left">Staff Member</TableHead>
            <TableHead className="h-11 py-3 text-left">Leave Type</TableHead>
            <TableHead className="h-11 py-3 text-left hidden md:table-cell">Department</TableHead>
            <TableHead className="h-11 py-3 text-left hidden lg:table-cell">Duration</TableHead>
            <TableHead className="h-11 py-3 text-left hidden xl:table-cell">Reason</TableHead>
            <TableHead className="h-11 py-3 text-left">Status</TableHead>
            <TableHead className="h-11 py-3 text-right w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => {
            const initials = getInitials({
              first_name: leave.first_name,
              last_name: leave.last_name,
            });

            return (
              <TableRow
                key={leave.leave_id}
                className="hover:bg-muted/10 border-b transition-colors last:border-0"
              >
                {/* Staff Member */}
                <TableCell className="text-foreground py-3.5 font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="border-border size-9 border">
                      <AvatarImage src={leave.avatar_url} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {initials || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">
                        {leave.first_name} {leave.last_name || ''}
                      </span>
                      <span className="text-muted-foreground mt-0.5 text-[10px] font-medium">
                        {leave.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Leave Type */}
                <TableCell className="py-3.5 text-xs">
                  <LeaveTypeBadge type={leave.leave_type} />
                </TableCell>

                {/* Department */}
                <TableCell className="text-muted-foreground hidden py-3.5 text-xs font-medium md:table-cell">
                  {leave.department_name || 'Staff'}
                </TableCell>

                {/* Duration */}
                <TableCell className="hidden py-3.5 lg:table-cell">
                  <div className="text-foreground text-xs font-medium">
                    {formatDate(leave.start_date, 'medium')} –{' '}
                    {formatDate(leave.end_date, 'medium')}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-[10px] font-medium">
                    {leave.total_days} {leave.total_days === 1 ? 'day' : 'days'}
                  </div>
                </TableCell>

                {/* Reason */}
                <TableCell
                  className="text-muted-foreground hidden max-w-40 truncate py-3.5 text-xs font-medium xl:table-cell"
                  title={leave.reason}
                >
                  {leave.reason}
                </TableCell>

                <TableCell className="py-3.5 text-xs">
                  <StatusBadge status={leave.status} />
                </TableCell>

                <TableCell className="py-3.5 text-right">
                  <div className="flex items-center justify-end">
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
                      <span className="text-muted-foreground text-xs font-medium">
                        Completed
                      </span>
                    )}
                  </div>
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

import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ACTIONS, BASE, STATUS } from '@/lib/icons';
import { cn, formatDate } from '@/lib/utils';

import {
  getDeptDescription,
  getDeptGradient,
  getDeptIcon,
} from '../../utils/departments.utils';

// Skeleton rows (loading state)
const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-4 w-40" />
        </div>
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-60" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-10" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
      </TableCell>
    </TableRow>
  ));

const DepartmentsTable = ({
  departments,
  staffCounts,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (isLoading) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-left">
              Department Name
            </TableHead>
            <TableHead className="h-11 py-3 text-left">Description</TableHead>
            <TableHead className="h-11 py-3 text-left">Staff</TableHead>
            <TableHead className="h-11 py-3 text-left">Status</TableHead>
            <TableHead className="h-11 py-3 text-left">Created Date</TableHead>
            <TableHead className="h-11 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => {
            const gradientClass = getDeptGradient(dept.name);
            const IconComponent = getDeptIcon(dept.name);
            const description = getDeptDescription(dept.name);
            const staffCount = staffCounts[dept.department_id] || 0;

            return (
              <TableRow
                key={dept.department_id}
                className="hover:bg-muted/10 border-b transition-colors last:border-0"
              >
                {/* Department Name */}
                <TableCell className="text-foreground py-3.5 font-medium">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl',
                        gradientClass
                      )}
                    >
                      <IconComponent className="size-4.5" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                      {dept.name}
                    </span>
                  </div>
                </TableCell>

                {/* Description */}
                <TableCell className="text-muted-foreground max-w-70 truncate py-3.5 text-xs font-medium">
                  {description}
                </TableCell>

                {/* Staff Count */}
                <TableCell className="text-foreground py-3.5 text-xs font-semibold tabular-nums">
                  {staffCount}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5 text-xs">
                  <StatusBadge status={dept.status} />
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-muted-foreground py-3.5 text-xs font-medium tabular-nums">
                  {formatDate(dept.created_at, 'short')}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Inline Edit Icon */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(dept)}
                      className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                      title="Edit Department"
                    >
                      <ACTIONS.EDIT className="size-4" />
                    </Button>

                    {/* More actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                        >
                          <BASE.MORE_V className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => onToggleStatus?.(dept)}
                          className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs"
                        >
                          {dept.status === 'active' ? (
                            <>
                              <STATUS.INACTIVE className="text-destructive size-3.5" />
                              <span className="text-destructive font-medium">
                                Deactivate
                              </span>
                            </>
                          ) : (
                            <>
                              <STATUS.ACTIVE className="text-success size-3.5" />
                              <span className="text-success font-medium">
                                Activate
                              </span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit?.(dept)}
                          className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs"
                        >
                          <ACTIONS.EDIT className="text-muted-foreground size-3.5" />
                          <span className="font-medium">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(dept)}
                          className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs"
                        >
                          <ACTIONS.DELETE className="text-destructive/80 size-3.5" />
                          <span className="font-medium">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default DepartmentsTable;

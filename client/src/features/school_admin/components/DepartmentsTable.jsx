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
import { COMMON, SCHOOL_ADMIN } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

// ── Skeleton rows (loading state) ─────────────────────────────

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-28" />
      </TableCell>
    </TableRow>
  ));

// ── Empty state ───────────────────────────────────────────────

const EmptyState = ({ onCreateClick }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
    <div
      aria-hidden
      className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl"
    >
      <SCHOOL_ADMIN.DEPARTMENTS className="size-6" />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-foreground font-medium">No departments yet</p>
      <p className="text-muted-foreground text-sm">
        Create your first department to start organizing your staff.
      </p>
    </div>
    <Button className="cursor-pointer gap-2" onClick={onCreateClick}>
      <COMMON.PLUS data-icon="inline-start" />
      Add Department
    </Button>
  </div>
);

// ── Main table ────────────────────────────────────────────────

const DepartmentsTable = ({ departments, isLoading, onCreateClick }) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead className="text-right">Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!departments?.length) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department Name</TableHead>
            <TableHead className="text-right">Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.department_id}>
              <TableCell className="font-medium">{dept.name}</TableCell>
              <TableCell className="text-muted-foreground text-right tabular-nums">
                {formatDate(dept.created_at, 'medium')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentsTable;

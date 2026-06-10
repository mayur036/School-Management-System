import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { SUPER_ADMIN } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

// ── Status badge ──────────────────────────────────────────────

// const StatusBadge = ({ status }) => {
//   const isActive = status === 'active';
//   return (
//     <Badge
//       className={
//         isActive
//           ? 'bg-success text-success-foreground'
//           : 'bg-destructive text-destructive-foreground'
//       }
//     >
//       <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
//       {isActive ? 'Active' : 'Inactive'}
//     </Badge>
//   );
// };

// ── Skeleton rows (loading state) ─────────────────────────────

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-8" />
      </TableCell>
    </TableRow>
  ));



// ── Main table ────────────────────────────────────────────────

const SchoolsTable = ({
  schools,
  isLoading,

  onToggleStatus,
  onAddAdmin,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
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

  if (!schools?.length) {
    return (
      <EmptyTableState
        icon={SUPER_ADMIN.SCHOOLS}
        title="No schools yet"
        description="Get started by registering your first school using the button above."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.school_id}>
              <TableCell className="font-medium">{school.name}</TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {school.code || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {school.email || '—'}
              </TableCell>
              <TableCell>
                <StatusBadge status={school.status} pulse={false} />
              </TableCell>
              <TableCell className="text-muted-foreground hidden tabular-nums lg:table-cell">
                {formatDate(school.created_at, 'medium')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      aria-label={`Actions for ${school.name}`}
                    >
                      <SUPER_ADMIN.ACTIONS />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => onAddAdmin(school)}
                      >
                        <SUPER_ADMIN.CREATE_ADMIN data-icon="inline-start" />
                        Add Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => onToggleStatus(school)}
                      >
                        <SUPER_ADMIN.POWER data-icon="inline-start" />
                        {school.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SchoolsTable;

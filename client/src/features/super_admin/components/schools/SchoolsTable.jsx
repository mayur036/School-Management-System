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
import { BASE, EMPTY_STATE, SUPER_ADMIN } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

// ── Skeleton rows (loading state) ─────────────────────────────

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 animate-pulse rounded-xl" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32 animate-pulse" />
            <Skeleton className="h-3 w-20 animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-12 animate-pulse" />
      </TableCell>
      <TableCell className="hidden py-3 md:table-cell">
        <Skeleton className="h-4 w-36 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 animate-pulse rounded-full" />
      </TableCell>
      <TableCell className="hidden py-3 lg:table-cell">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <Skeleton className="ml-auto h-8 w-8 animate-pulse rounded-lg" />
      </TableCell>
    </TableRow>
  ));

// ── Main table ────────────────────────────────────────────────

const SchoolsTable = ({
  schools,
  isLoading,
  onToggleStatus,
  onAddAdmin,
  onEditSchool,
  sortBy,
  sortOrder,
  onSort,
}) => {
  if (isLoading) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
              <TableHead className="h-11 py-3 text-left">Name</TableHead>
              <TableHead className="h-11 py-3 text-left">Code</TableHead>
              <TableHead className="hidden h-11 py-3 text-left md:table-cell">
                Email
              </TableHead>
              <TableHead className="h-11 py-3 text-left">Status</TableHead>
              <TableHead className="hidden h-11 py-3 text-left lg:table-cell">
                Created
              </TableHead>
              <TableHead className="h-11 w-12 py-3 text-right">
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
        icon={EMPTY_STATE.NO_DATA}
        title="No schools yet"
        description="Get started by registering your first school using the button above."
      />
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead
              className="hover:bg-muted/20 h-11 cursor-pointer py-3 text-left select-none"
              onClick={() => onSort?.('name')}
            >
              <div className="flex items-center gap-1">
                Name
                {sortBy === 'name' ? (
                  sortOrder === 'ASC' ? (
                    <BASE.CHEVRON_UP className="size-3" />
                  ) : (
                    <BASE.CHEVRON_DOWN className="size-3" />
                  )
                ) : (
                  <BASE.CHEVRON_SORT className="text-muted-foreground/55 size-3" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="hover:bg-muted/20 h-11 cursor-pointer py-3 text-left select-none"
              onClick={() => onSort?.('code')}
            >
              <div className="flex items-center gap-1">
                Code
                {sortBy === 'code' ? (
                  sortOrder === 'ASC' ? (
                    <BASE.CHEVRON_UP className="size-3" />
                  ) : (
                    <BASE.CHEVRON_DOWN className="size-3" />
                  )
                ) : (
                  <BASE.CHEVRON_SORT className="text-muted-foreground/55 size-3" />
                )}
              </div>
            </TableHead>
            <TableHead className="hidden h-11 py-3 text-left md:table-cell">
              Email
            </TableHead>
            <TableHead
              className="hover:bg-muted/20 h-11 cursor-pointer py-3 text-left select-none"
              onClick={() => onSort?.('status')}
            >
              <div className="flex items-center gap-1">
                Status
                {sortBy === 'status' ? (
                  sortOrder === 'ASC' ? (
                    <BASE.CHEVRON_UP className="size-3" />
                  ) : (
                    <BASE.CHEVRON_DOWN className="size-3" />
                  )
                ) : (
                  <BASE.CHEVRON_SORT className="text-muted-foreground/55 size-3" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="hover:bg-muted/20 hidden h-11 cursor-pointer py-3 text-left select-none lg:table-cell"
              onClick={() => onSort?.('created_at')}
            >
              <div className="flex items-center gap-1">
                Created
                {sortBy === 'created_at' ? (
                  sortOrder === 'ASC' ? (
                    <BASE.CHEVRON_UP className="size-3" />
                  ) : (
                    <BASE.CHEVRON_DOWN className="size-3" />
                  )
                ) : (
                  <BASE.CHEVRON_SORT className="text-muted-foreground/55 size-3" />
                )}
              </div>
            </TableHead>
            <TableHead className="h-11 w-12 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow
              key={school.school_id}
              className="hover:bg-muted/10 border-b transition-colors last:border-0"
            >
              <TableCell className="text-foreground py-3.5 font-medium">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-xl border">
                    <BASE.BUILDING className="size-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">
                      {school.name}
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-xs font-medium">
                      {school.domain || '—'}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground py-3.5 text-xs font-medium tabular-nums">
                {school.code || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground hidden py-3.5 text-xs font-medium md:table-cell">
                {school.email || '—'}
              </TableCell>
              <TableCell className="py-3.5 text-xs">
                <StatusBadge status={school.status} pulse={false} />
              </TableCell>
              <TableCell className="text-muted-foreground hidden py-3.5 text-xs font-medium tabular-nums lg:table-cell">
                {formatDate(school.created_at, 'short')}
              </TableCell>
              <TableCell className="py-3.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                      aria-label={`Actions for ${school.name}`}
                    >
                      <BASE.MORE_V className="size-4" />
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
                        onClick={() => onEditSchool(school)}
                      >
                        <BASE.EDIT
                          className="text-muted-foreground size-4"
                          data-icon="inline-start"
                        />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2"
                        onClick={() => onToggleStatus(school)}
                      >
                        <BASE.POWER
                          className="text-muted-foreground size-4"
                          data-icon="inline-start"
                        />
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

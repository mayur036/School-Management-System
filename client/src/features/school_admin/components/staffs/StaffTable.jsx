import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge, { DepartmentBadge } from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { BASE, EMPTY_STATE, SCHOOL_ADMIN } from '@/lib/icons';
import { formatDate, formatStaffId, getInitials } from '@/lib/utils';

// ── Skeleton rows (loading state) ─────────────────────────────

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell className="py-3 flex items-center gap-3">
        <Skeleton className="size-9 rounded-full animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32 animate-pulse" />
          <Skeleton className="h-3 w-20 animate-pulse" />
        </div>
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-24 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="hidden py-3 md:table-cell">
        <Skeleton className="h-4 w-36 animate-pulse" />
      </TableCell>
      <TableCell className="hidden py-3 lg:table-cell">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="hidden py-3 xl:table-cell">
        <Skeleton className="h-4 w-20 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <Skeleton className="ml-auto h-8 w-8 rounded-lg animate-pulse" />
      </TableCell>
    </TableRow>
  ));

const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-2 gap-x-3 gap-y-12 pt-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <Card
        key={i}
        className="border-border relative mt-10 flex w-full flex-col items-center gap-3 overflow-visible rounded-2xl border p-4 pt-14 shadow-xs"
      >
        <div className="absolute top-3 right-2">
          <Skeleton className="size-7 rounded-md" />
        </div>
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-16 rounded-t-2xl bg-linear-to-b from-emerald-500/5 to-transparent" />
        <Skeleton className="border-card absolute -top-10 left-1/2 size-20 -translate-x-1/2 rounded-full border-4 shadow-sm" />
        <div className="flex w-full flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mt-1 h-5 w-24 rounded-full" />
        <div className="my-1 flex w-full items-center gap-3">
          <div className="bg-border/40 h-px flex-1" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <div className="bg-border/40 h-px flex-1" />
        </div>
        <div className="border-border/20 flex w-full items-center gap-2.5 rounded-xl border p-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="border-border/20 flex w-full items-center gap-2.5 rounded-xl border p-2">
          <Skeleton className="size-4 shrink-0 rounded" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// ── Grid Card Item ─────────────────────────────────────────────

const StaffCard = ({ member, onViewDetails, onToggleStatus }) => {
  const initials = getInitials(member);
  return (
    <Card className="border-border bg-card relative flex flex-col items-center gap-3 overflow-visible rounded-2xl border p-4 pt-14 text-center shadow-xs transition-all hover:shadow-md">
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-16 rounded-t-2xl bg-linear-to-b from-emerald-500/10 to-transparent" />

      <Avatar className="border-card absolute -top-10 left-1/2 size-20 -translate-x-1/2 border-4 shadow-md">
        <AvatarImage
          src={member.avatar_url}
          alt={`${member.first_name} ${member.last_name}`}
        />
        <AvatarFallback className="bg-emerald-100 text-lg font-bold text-emerald-800">
          {initials || 'ST'}
        </AvatarFallback>
      </Avatar>

      <div className="absolute top-3 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/75 hover:bg-muted/50 size-7 cursor-pointer rounded-full"
              aria-label={`Actions for ${member.first_name} ${member.last_name}`}
            >
              <BASE.MORE_V className="size-3.5 sm:size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onViewDetails(member)}
              >
                <SCHOOL_ADMIN.PROFILE
                  className="text-muted-foreground size-4"
                  data-icon="inline-start"
                />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => onToggleStatus(member)}
              >
                <BASE.POWER
                  className="text-muted-foreground size-4"
                  data-icon="inline-start"
                />
                {member.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col items-center leading-tight">
        <h3 className="text-foreground text-base font-bold tracking-tight">
          {member.first_name} {member.last_name}
        </h3>
        <span className="text-muted-foreground/80 mt-1 font-mono text-[10px] tracking-wider uppercase">
          ID: {formatStaffId(member.staff_id)}
        </span>
      </div>

      <div className="mt-0.5">
        <DepartmentBadge department={member.department_name} />
      </div>

      <div className="my-1 flex w-full items-center gap-3">
        <div className="bg-border/60 h-px flex-1" />
        <StatusBadge status={member.status} />
        <div className="bg-border/60 h-px flex-1" />
      </div>

      <div className="bg-muted/30 border-border/40 text-muted-foreground/90 hover:bg-muted/50 flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-[11px] transition-colors">
        <BASE.MAIL className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="truncate font-mono">{member.email}</span>
      </div>

      <div className="bg-muted/30 border-border/40 text-muted-foreground/90 hover:bg-muted/50 flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-[11px] transition-colors">
        <BASE.CALENDAR className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="flex flex-col text-left leading-tight">
          <span className="text-foreground font-semibold">
            {formatDate(member.created_at, 'medium')}
          </span>
          <span className="text-muted-foreground/70 mt-0.5 text-[9px]">
            Join Date
          </span>
        </div>
      </div>
    </Card>
  );
};

// ── Main Component ─────────────────────────────────────────────

const StaffTable = ({
  staff,
  isLoading,
  viewMode = 'list',
  onViewDetails,
  onToggleStatus,
  sortBy,
  sortOrder,
  onSort,
}) => {
  if (isLoading) {
    return viewMode === 'list' ? (
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
              <TableHead className="h-11 py-3 text-left">Staff Member</TableHead>
              <TableHead className="h-11 py-3 text-left">Department</TableHead>
              <TableHead className="hidden h-11 py-3 text-left md:table-cell">Email</TableHead>
              <TableHead className="hidden h-11 py-3 text-left lg:table-cell">Phone</TableHead>
              <TableHead className="h-11 py-3 text-left">Status</TableHead>
              <TableHead className="hidden h-11 py-3 text-left xl:table-cell">Registered</TableHead>
              <TableHead className="h-11 py-3 text-right w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows />
          </TableBody>
        </Table>
      </div>
    ) : (
      <SkeletonGrid />
    );
  }

  if (!staff?.length) {
    return (
      <EmptyTableState
        icon={EMPTY_STATE.NO_DATA}
        title="No staff members found"
        description="Try adjusting your filters, search terms, or register a new staff member."
      />
    );
  }

  // Grid / Card view rendering
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-12 pt-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-4">
        {staff.map((member) => (
          <StaffCard
            key={member.staff_id}
            member={member}
            onViewDetails={onViewDetails}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    );
  }

  // Table (List) view rendering (responsive grid on small screens)
  return (
    <>
      {/* Desktop/Tablet List View */}
      <div className="border-border bg-card hidden overflow-hidden rounded-xl border shadow-xs md:block">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
              <TableHead
                className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
                onClick={() => onSort?.('first_name')}
              >
                <div className="flex items-center gap-1">
                  Staff Member
                  {sortBy === 'first_name' ? (
                    sortOrder === 'ASC' ? <BASE.CHEVRON_UP className="size-3" /> : <BASE.CHEVRON_DOWN className="size-3" />
                  ) : (
                    <BASE.CHEVRON_SORT className="size-3 text-muted-foreground/55" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
                onClick={() => onSort?.('department_name')}
              >
                <div className="flex items-center gap-1">
                  Department
                  {sortBy === 'department_name' ? (
                    sortOrder === 'ASC' ? <BASE.CHEVRON_UP className="size-3" /> : <BASE.CHEVRON_DOWN className="size-3" />
                  ) : (
                    <BASE.CHEVRON_SORT className="size-3 text-muted-foreground/55" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="hidden h-11 py-3 text-left md:table-cell cursor-pointer select-none hover:bg-muted/20"
                onClick={() => onSort?.('email')}
              >
                <div className="flex items-center gap-1">
                  Email
                  {sortBy === 'email' ? (
                    sortOrder === 'ASC' ? <BASE.CHEVRON_UP className="size-3" /> : <BASE.CHEVRON_DOWN className="size-3" />
                  ) : (
                    <BASE.CHEVRON_SORT className="size-3 text-muted-foreground/55" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden h-11 py-3 text-left lg:table-cell">Phone</TableHead>
              <TableHead
                className="h-11 py-3 text-left cursor-pointer select-none hover:bg-muted/20"
                onClick={() => onSort?.('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortBy === 'status' ? (
                    sortOrder === 'ASC' ? <BASE.CHEVRON_UP className="size-3" /> : <BASE.CHEVRON_DOWN className="size-3" />
                  ) : (
                    <BASE.CHEVRON_SORT className="size-3 text-muted-foreground/55" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="hidden h-11 py-3 text-left xl:table-cell cursor-pointer select-none hover:bg-muted/20"
                onClick={() => onSort?.('created_at')}
              >
                <div className="flex items-center gap-1">
                  Registered
                  {sortBy === 'created_at' ? (
                    sortOrder === 'ASC' ? <BASE.CHEVRON_UP className="size-3" /> : <BASE.CHEVRON_DOWN className="size-3" />
                  ) : (
                    <BASE.CHEVRON_SORT className="size-3 text-muted-foreground/55" />
                  )}
                </div>
              </TableHead>
              <TableHead className="h-11 py-3 text-right w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => {
              const initials = getInitials(member);
              return (
                <TableRow
                  key={member.staff_id}
                  className="hover:bg-muted/10 border-b transition-colors last:border-0"
                >
                  <TableCell className="text-foreground py-3.5 font-medium flex items-center gap-3">
                    <Avatar className="border-border size-9 border">
                      <AvatarImage
                        src={member.avatar_url}
                        alt={`${member.first_name} ${member.last_name}`}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {initials || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">
                        {member.first_name} {member.last_name}
                      </span>
                      <span className="text-muted-foreground mt-0.5 font-mono text-[10px] font-medium">
                        Staff ID: {formatStaffId(member.staff_id)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-xs">
                    <DepartmentBadge department={member.department_name} />
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden py-3.5 font-mono text-xs font-medium md:table-cell">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden py-3.5 font-mono text-xs font-medium lg:table-cell">
                    {member.phone || '—'}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs">
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden py-3.5 text-xs font-medium tabular-nums xl:table-cell">
                    {formatDate(member.created_at, 'short')}
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                          aria-label={`Actions for ${member.first_name} ${member.last_name}`}
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
                            onClick={() => onViewDetails(member)}
                          >
                            <SCHOOL_ADMIN.PROFILE
                              className="text-muted-foreground size-4"
                              data-icon="inline-start"
                            />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer gap-2"
                            onClick={() => onToggleStatus(member)}
                          >
                            <BASE.POWER
                              className="text-muted-foreground size-4"
                              data-icon="inline-start"
                            />
                            {member.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Grid View fallback */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-12 pt-10 md:hidden">
        {staff.map((member) => (
          <StaffCard
            key={member.staff_id}
            member={member}
            onViewDetails={onViewDetails}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    </>
  );
};

export default StaffTable;

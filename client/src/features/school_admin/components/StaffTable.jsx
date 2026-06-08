import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { SCHOOL_ADMIN, SUPER_ADMIN } from '@/lib/icons';
import { formatDate, formatStaffId } from '@/lib/utils';

// ── Status badge ──────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const isActive = status === 'active';
  return (
    <Badge
      className={
        isActive
          ? 'bg-success/10 text-success border-success/20 hover:bg-success/20 font-medium'
          : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-medium'
      }
      variant="outline"
    >
      <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-current" />
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};

// ── Department badge styling helper ────────────────────────────

const getDeptBadgeClass = (deptName) => {
  if (!deptName) return 'bg-muted/50 text-muted-foreground border-border';
  const name = deptName.toLowerCase();
  if (name.includes('math')) {
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  }
  if (name.includes('science')) {
    return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20';
  }
  if (
    name.includes('lang') ||
    name.includes('literature') ||
    name.includes('english')
  ) {
    return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20';
  }
  if (name.includes('admin') || name.includes('office')) {
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
  }
  if (name.includes('account') || name.includes('finance')) {
    return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
  }
  return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
};

// ── Skeleton rows (loading state) ─────────────────────────────

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-8" />
      </TableCell>
    </TableRow>
  ));

const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="border-border flex flex-col gap-4 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-2 flex justify-between border-t pt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </Card>
    ))}
  </div>
);

// ── Grid Card Item ─────────────────────────────────────────────

const StaffCard = ({ member, onViewDetails, onToggleStatus }) => {
  const initials =
    `${member.first_name?.[0] ?? ''}${member.last_name?.[0] ?? ''}`.toUpperCase();
  return (
    <Card className="border-border bg-card relative flex flex-col gap-4 p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="border-border size-10 border">
            <AvatarImage
              src={member.avatar_url}
              alt={`${member.first_name} ${member.last_name}`}
            />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
              {initials || 'ST'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-foreground text-sm leading-tight font-semibold">
              {member.first_name} {member.last_name}
            </span>
            <span className="text-muted-foreground mt-0.5 font-mono text-xs">
              Staff ID: {formatStaffId(member.staff_id)}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
              aria-label={`Actions for ${member.first_name} ${member.last_name}`}
            >
              <SUPER_ADMIN.ACTIONS className="size-4" />
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
                <SUPER_ADMIN.POWER
                  className="text-muted-foreground size-4"
                  data-icon="inline-start"
                />
                {member.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <Badge
            className={`border font-normal ${getDeptBadgeClass(member.department_name)}`}
            variant="outline"
          >
            {member.department_name || 'Unassigned'}
          </Badge>
        </div>
        <span className="text-muted-foreground font-mono text-xs break-all">
          {member.email}
        </span>
      </div>

      <div className="border-border/60 mt-2 flex items-center justify-between border-t pt-3 text-xs">
        <StatusBadge status={member.status} />
        <span className="text-muted-foreground font-mono">
          {formatDate(member.created_at, 'medium')}
        </span>
      </div>
    </Card>
  );
};

const EmptyState = () => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
    <div
      aria-hidden
      className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl"
    >
      <SCHOOL_ADMIN.STAFF_LIST className="size-6" />
    </div>
    <div className="flex flex-col gap-1">
      <p className="text-foreground font-medium">No staff members found</p>
      <p className="text-muted-foreground text-sm">
        Try adjusting your filters, search terms, or register a new staff
        member.
      </p>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────

const StaffTable = ({
  staff,
  isLoading,
  viewMode = 'list',
  onViewDetails,
  onToggleStatus,
}) => {
  if (isLoading) {
    return viewMode === 'list' ? (
      <div className="bg-card overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Registered</TableHead>
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
    ) : (
      <SkeletonGrid />
    );
  }

  if (!staff?.length) {
    return <EmptyState />;
  }

  // Grid / Card view rendering
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="bg-card hidden overflow-x-auto rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Registered</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => {
              const initials =
                `${member.first_name?.[0] ?? ''}${member.last_name?.[0] ?? ''}`.toUpperCase();
              return (
                <TableRow key={member.staff_id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="border-border size-10 border">
                      <AvatarImage
                        src={member.avatar_url}
                        alt={`${member.first_name} ${member.last_name}`}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {initials || 'ST'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {member.first_name} {member.last_name}
                      </span>
                      <span className="text-muted-foreground mt-0.5 font-mono text-[10px]">
                        Staff ID: {formatStaffId(member.staff_id)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border font-normal ${getDeptBadgeClass(member.department_name)}`}
                      variant="outline"
                    >
                      {member.department_name || 'Unassigned'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden font-mono text-xs lg:table-cell">
                    {member.phone || '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-xs tabular-nums xl:table-cell">
                    {formatDate(member.created_at, 'medium')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          aria-label={`Actions for ${member.first_name} ${member.last_name}`}
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
                            <SUPER_ADMIN.POWER
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
      <div className="grid grid-cols-1 gap-6 md:hidden">
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

import { Calendar, Mail } from 'lucide-react';

import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge from '@/components/shared/StatusBadge';
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
import { BASE, EMPTY_STATE, SCHOOL_ADMIN } from '@/lib/icons';
import { formatDate, formatStaffId, getInitials } from '@/lib/utils';

import { getDeptBadgeClass } from '../../utils/departments.utils';

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
        <Badge className="rounded-full border-none bg-purple-100 px-4 py-0.5 text-[11px] font-semibold wrap-break-word text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-950/40">
          {member.department_name || 'Unassigned'}
        </Badge>
      </div>

      <div className="my-1 flex w-full items-center gap-3">
        <div className="bg-border/60 h-px flex-1" />
        <Badge
          className={`flex items-center gap-1.5 rounded-full border-none px-3 py-0.5 text-[11px] font-semibold ${
            member.status === 'active'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}
          />
          {member.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
        <div className="bg-border/60 h-px flex-1" />
      </div>

      <div className="bg-muted/30 border-border/40 text-muted-foreground/90 hover:bg-muted/50 flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-[11px] transition-colors">
        <Mail className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="truncate font-mono">{member.email}</span>
      </div>

      <div className="bg-muted/30 border-border/40 text-muted-foreground/90 hover:bg-muted/50 flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-[11px] transition-colors">
        <Calendar className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
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
              const initials = getInitials(member);
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
                    <StatusBadge status={member.status} pulse />
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

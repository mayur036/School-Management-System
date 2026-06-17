import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge from '@/components/shared/StatusBadge';
import UserAvatar from '@/components/shared/UserAvatar';
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
import { ACTIONS, BASE, EMPTY_STATE } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32 animate-pulse" />
            <Skeleton className="h-3 w-24 animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden py-3 md:table-cell">
        <Skeleton className="h-4 w-36 animate-pulse" />
      </TableCell>
      <TableCell className="hidden py-3 md:table-cell">
        <Skeleton className="h-4 w-28 animate-pulse" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="hidden py-3 lg:table-cell">
        <Skeleton className="h-4 w-24 animate-pulse" />
      </TableCell>
      <TableCell className="py-3 text-right">
        <Skeleton className="ml-auto h-8 w-8 rounded-lg animate-pulse" />
      </TableCell>
    </TableRow>
  ));

const AdminsTable = ({ admins, isLoading, onToggleStatus, onDeleteAdmin }) => {
  if (isLoading) {
    return (
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
              <TableHead className="h-11 py-3 text-left">Admin</TableHead>
              <TableHead className="hidden h-11 py-3 text-left md:table-cell">School</TableHead>
              <TableHead className="hidden h-11 py-3 text-left md:table-cell">Phone</TableHead>
              <TableHead className="h-11 py-3 text-left">Status</TableHead>
              <TableHead className="hidden h-11 py-3 text-left lg:table-cell">Joined</TableHead>
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
    );
  }

  if (!admins?.length) {
    return (
      <EmptyTableState
        icon={EMPTY_STATE.NO_DATA}
        title="No admins found"
        description="Register a school and add its administrators to see them here."
      />
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase hover:bg-transparent">
            <TableHead className="h-11 py-3 text-left">Admin</TableHead>
            <TableHead className="hidden h-11 py-3 text-left md:table-cell">School</TableHead>
            <TableHead className="hidden h-11 py-3 text-left md:table-cell">Phone</TableHead>
            <TableHead className="h-11 py-3 text-left">Status</TableHead>
            <TableHead className="hidden h-11 py-3 text-left lg:table-cell">Joined</TableHead>
            <TableHead className="h-11 py-3 text-right w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow
              key={admin.staff_id}
              className="hover:bg-muted/10 border-b transition-colors last:border-0"
            >
              <TableCell className="text-foreground py-3.5 font-medium">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={`${admin.first_name} ${admin.last_name}`}
                    avatarUrl={admin.avatar_url}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">{`${admin.first_name} ${admin.last_name}`}</span>
                    <span className="text-muted-foreground text-xs font-medium mt-0.5">
                      {admin.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden py-3.5 text-xs font-semibold md:table-cell">
                {admin.school_name || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground hidden py-3.5 text-xs font-medium md:table-cell">
                {admin.phone || '—'}
              </TableCell>
              <TableCell className="py-3.5 text-xs">
                <StatusBadge status={admin.status} pulse={false} />
              </TableCell>
              <TableCell className="text-muted-foreground hidden py-3.5 text-xs font-medium tabular-nums lg:table-cell">
                {formatDate(admin.created_at, 'short')}
              </TableCell>
              <TableCell className="py-3.5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8 cursor-pointer rounded-lg"
                      aria-label={`Actions for ${admin.first_name}`}
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
                        onClick={() => onToggleStatus(admin)}
                      >
                        <BASE.POWER
                          className="text-muted-foreground size-4"
                          data-icon="inline-start"
                        />
                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer flex-nowrap gap-2 whitespace-nowrap"
                        onClick={() => onDeleteAdmin(admin)}
                      >
                        <ACTIONS.DELETE className="size-4 shrink-0" />
                        Delete Admin
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

export default AdminsTable;

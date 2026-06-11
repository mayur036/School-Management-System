import EmptyTableState from '@/components/shared/EmptyTableState';
import StatusBadge from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { COMMON, SUPER_ADMIN } from '@/lib/icons';
import { formatDate, getInitials } from '@/lib/utils';

const SkeletonRows = ({ count = 5 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-28" />
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

const AdminsTable = ({ admins, isLoading, onToggleStatus, onDeleteAdmin }) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin</TableHead>
              <TableHead className="hidden md:table-cell">School</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
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

  if (!admins?.length) {
    return (
      <EmptyTableState
        icon={SUPER_ADMIN.USERS}
        title="No admins found"
        description="Register a school and add its administrators to see them here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin</TableHead>
            <TableHead className="hidden md:table-cell">School</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Joined</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.staff_id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border">
                    <AvatarImage
                      src={admin.avatar_url}
                      alt={`${admin.first_name} ${admin.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs">
                      {getInitials(admin.first_name, admin.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {admin.first_name} {admin.last_name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {admin.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden font-medium md:table-cell">
                {admin.school_name || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground hidden md:table-cell">
                {admin.phone || '—'}
              </TableCell>
              <TableCell>
                <StatusBadge status={admin.status} pulse={false} />
              </TableCell>
              <TableCell className="text-muted-foreground hidden tabular-nums lg:table-cell">
                {formatDate(admin.created_at, 'medium')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      aria-label={`Actions for ${admin.first_name}`}
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
                        onClick={() => onToggleStatus(admin)}
                      >
                        <SUPER_ADMIN.POWER data-icon="inline-start" />
                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer flex-nowrap gap-2 whitespace-nowrap"
                        onClick={() => onDeleteAdmin(admin)}
                      >
                        <COMMON.TRASH className="size-4 shrink-0" />
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

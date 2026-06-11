import { Link } from 'react-router-dom';

import StatusBadge from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE, SCHOOL_ADMIN } from '@/lib/icons';
import { formatDate, getInitials } from '@/lib/utils';

const RecentStaff = ({ staff = [], isLoading }) => (
  <Card className="border-border bg-card">
    <CardHeader className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-col gap-1.5">
        <CardTitle className="text-base">Recent Staff</CardTitle>
        <CardDescription>Newest members in your school</CardDescription>
      </div>
      <Link
        to="/school/staff"
        className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
      >
        View all
        <BASE.ARROW_RIGHT className="size-3.5" />
      </Link>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-muted-foreground flex min-h-50 flex-col items-center justify-center gap-2 text-center text-sm">
          <SCHOOL_ADMIN.STAFF_LIST className="size-8 opacity-40" />
          No staff registered yet
        </div>
      ) : (
        <ul className="divide-border/60 flex flex-col divide-y">
          {staff.map((member) => {
            const initials = getInitials(member);
            return (
              <li
                key={member.staff_id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <Avatar className="border-border size-10 border">
                  <AvatarImage
                    src={member.avatar_url}
                    alt={`${member.first_name} ${member.last_name}`}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                    {initials || 'ST'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="text-foreground truncate text-sm font-medium">
                    {member.first_name} {member.last_name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {member.department_name || 'Unassigned'}
                  </span>
                </div>
                <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={member.status} />
                  <span className="text-muted-foreground hidden text-[10px] tabular-nums sm:block">
                    {formatDate(member.created_at, 'medium')}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentStaff;

import { format, parseISO } from 'date-fns';

import StatusBadge from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EMPTY_STATE } from '@/lib/icons';

export const RecentSchools = ({ schools = [], isLoading }) => {
  return (
    <Card className="border-border bg-card flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Recently Onboarded Schools</CardTitle>
        <CardDescription>Latest schools added to the platform</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-37.5" />
                  <Skeleton className="h-4 w-25" />
                </div>
              </div>
            ))}
          </div>
        ) : schools.length === 0 ? (
          <div className="text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 text-center text-sm">
            <EMPTY_STATE.NO_DATA className="size-8 opacity-40" />
            No schools recently onboarded
          </div>
        ) : (
          <div className="space-y-4">
            {schools.map((school) => {
              const dateObj = school.created_at
                ? parseISO(school.created_at)
                : null;

              return (
                <div
                  key={school.school_id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary uppercase">
                        {school.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {school.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {school.code || 'N/A'} •{' '}
                        {dateObj ? format(dateObj, 'MMM d, yyyy') : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={school.status} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSchools;

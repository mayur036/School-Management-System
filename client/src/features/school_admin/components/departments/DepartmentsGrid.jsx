import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ACTIONS, BASE, STATUS } from '@/lib/icons';
import { cn, formatDate } from '@/lib/utils';

import { getDeptGradient, getDeptIcon } from '../../utils/departments.utils';

export const DepartmentsGrid = ({
  departments,
  staffCounts,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {departments.map((dept) => {
        const gradientClass = getDeptGradient(dept.name);
        const IconComponent = getDeptIcon(dept.name);
        const staffCount = staffCounts[dept.department_id] || 0;

        return (
          <Card
            key={dept.department_id}
            className="border-border bg-card border shadow-xs transition-all duration-300 hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3.5">
                {/* Colored Icon */}
                <div
                  className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-xl',
                    gradientClass
                  )}
                >
                  <IconComponent className="size-5" />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="text-foreground truncate text-sm font-bold">
                    {dept.name}
                  </span>
                  <span className="text-muted-foreground mt-1 text-[11px]">
                    {staffCount} Staff &middot;{' '}
                    {formatDate(dept.created_at, 'short')}
                  </span>

                  {/* Status indicator */}
                  <div className="mt-2.5">
                    <StatusBadge
                      status={dept.status}
                      className="h-5 px-2 text-[10px]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 cursor-pointer rounded-lg"
                  >
                    <BASE.MORE_V className="text-muted-foreground size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => onToggleStatus?.(dept)}
                    className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs"
                  >
                    {dept.status === 'active' ? (
                      <>
                        <STATUS.INACTIVE className="text-destructive size-3.5" />
                        <span className="text-destructive font-medium">
                          Deactivate
                        </span>
                      </>
                    ) : (
                      <>
                        <STATUS.ACTIVE className="text-success size-3.5" />
                        <span className="text-success font-medium">
                          Activate
                        </span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEdit?.(dept)}
                    className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs"
                  >
                    <ACTIONS.EDIT className="text-muted-foreground size-3.5" />
                    <span className="font-medium">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(dept)}
                    className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2 px-2.5 py-1.5 text-xs"
                  >
                    <ACTIONS.DELETE className="text-destructive/80 size-3.5" />
                    <span className="font-medium">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DepartmentsGrid;

import { Edit, MoreVertical, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatDate } from '@/lib/utils';

import { getDeptGradient, getDeptIcon } from '../utils/departments.utils';

// Static threshold calculated at load time to ensure component rendering is pure
const CUTOFF_DATE = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export const DepartmentsGrid = ({
  departments,
  staffCounts,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {departments.map((dept) => {
        const gradientClass = getDeptGradient(dept.name);
        const IconComponent = getDeptIcon(dept.name);
        const staffCount = staffCounts[dept.department_id] || 0;
        const isNew = new Date(dept.created_at) > CUTOFF_DATE;

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
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        dept.status === 'active'
                          ? isNew
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-red-500'
                      )}
                    />
                    <span className="text-muted-foreground text-[10px] font-medium capitalize">
                      {dept.status === 'active'
                        ? isNew
                          ? 'New'
                          : 'active'
                        : 'inactive'}
                    </span>
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
                    <MoreVertical className="text-muted-foreground size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  <DropdownMenuItem
                    onClick={() => onEdit?.(dept)}
                    className="cursor-pointer gap-2"
                  >
                    <Edit className="size-3.5" />
                    <span>Edit Department</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(dept)}
                    className="text-destructive focus:text-destructive cursor-pointer gap-2"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete Department</span>
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

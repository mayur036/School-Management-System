import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetStaffTasksQuery,
  useUpdateTaskStatusMutation,
} from '@/features/staff/staffActivity.api';
import { EMPTY_STATE } from '@/lib/icons';
import { formatDate } from '@/lib/utils';

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
};

export const TasksPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { data, isLoading } = useGetStaffTasksQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateTaskStatusMutation();

  console.log(data);

  const tasks = data?.data?.tasks || [];

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Task status updated to ${status.replace('_', ' ')}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update task status');
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const renderTaskCard = (task) => {
    const overdue = isOverdue(task.due_date, task.status);

    return (
      <Card
        key={task.task_id}
        className={`border-border bg-card hover:border-border/80 shadow-sm transition-all ${
          overdue ? 'border-l-4 border-l-rose-500' : ''
        }`}
      >
        <CardHeader className="flex flex-col gap-2 space-y-0 pb-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-foreground text-sm leading-tight font-semibold">
              {task.title}
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              Assigned by: {task.creator_name || 'Admin'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {overdue && (
              <Badge className="border-none bg-rose-500/10 px-2 py-0 text-[10px] font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400">
                Overdue
              </Badge>
            )}
            {task.due_date && (
              <Badge
                variant="outline"
                className="border-border text-muted-foreground px-2 py-0 text-[10px] font-normal"
              >
                Due: {formatDate(task.due_date, 'medium')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-muted-foreground text-xs leading-relaxed">
            {task.description || 'No description provided.'}
          </CardDescription>

          <div className="border-border flex justify-end gap-2 border-t pt-3">
            {task.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border h-7 px-2.5 text-xs font-medium"
                  disabled={isUpdating}
                  onClick={() =>
                    handleStatusUpdate(task.task_id, 'in_progress')
                  }
                >
                  Start Task
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs font-medium"
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(task.task_id, 'completed')}
                >
                  Complete
                </Button>
              </>
            )}

            {task.status === 'in_progress' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border h-7 px-2.5 text-xs font-medium"
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(task.task_id, 'pending')}
                >
                  Stop
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs font-medium"
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(task.task_id, 'completed')}
                >
                  Complete
                </Button>
              </>
            )}

            {task.status === 'completed' && (
              <Button
                size="sm"
                variant="outline"
                className="border-border h-7 px-2.5 text-xs font-medium"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(task.task_id, 'in_progress')}
              >
                Reopen Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            My Duties & Tasks
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage tasks and assignments assigned by the administration
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge className="border-none bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-500/20 dark:text-blue-400">
            {tasks.length} Total Tasks
          </Badge>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="border-border bg-muted/60 rounded-lg border p-1 shadow-sm">
          <TabsTrigger
            value="pending"
            className="group data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
          >
            To Do
            <span className="ml-1.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white dark:text-blue-400">
              {todoTasks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="in_progress"
            className="group data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
          >
            In Progress
            <span className="ml-1.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white dark:text-blue-400">
              {inProgressTasks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="group data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-4 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
          >
            Completed
            <span className="ml-1.5 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white dark:text-blue-400">
              {completedTasks.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : todoTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {todoTasks.map(renderTaskCard)}
            </div>
          ) : (
            <div className="border-border bg-card mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border py-16 text-center shadow-sm">
              <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
              <h3 className="text-foreground text-sm font-semibold">
                No Pending Tasks
              </h3>
              <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                You don't have any tasks waiting to be started.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full" />
            </div>
          ) : inProgressTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {inProgressTasks.map(renderTaskCard)}
            </div>
          ) : (
            <div className="border-border bg-card mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border py-16 text-center shadow-sm">
              <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
              <h3 className="text-foreground text-sm font-semibold">
                No Tasks In Progress
              </h3>
              <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                You are not currently working on any tasks. Start a task from
                the To Do tab!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-28 w-full" />
            </div>
          ) : completedTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {completedTasks.map(renderTaskCard)}
            </div>
          ) : (
            <div className="border-border bg-card mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border py-16 text-center shadow-sm">
              <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
              <h3 className="text-foreground text-sm font-semibold">
                No Completed Tasks
              </h3>
              <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                You haven't completed any tasks yet. Keep up the good work!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useGetStaffQuery } from '@/features/school_admin/staff.api';
import {
  useAssignTaskMutation,
  useDeleteStaffTaskMutation,
  useListSchoolTasksQuery,
} from '@/features/staff/staffActivity.api';
import { ACTIONS, EMPTY_STATE } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import { assignTaskSchema } from '@/schemas/staff.schema';

export const TasksPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Queries
  const { data: tasksData, isLoading: isTasksLoading } =
    useListSchoolTasksQuery();
  const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();

  // Mutations
  const [assignTask, { isLoading: isAssigning }] = useAssignTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteStaffTaskMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: {
      staff_id: '',
      title: '',
      description: '',
      due_date: '',
    },
  });

  const staffIdVal = watch('staff_id');

  const onTaskSubmit = async (values) => {
    try {
      const res = await assignTask(values).unwrap();
      toast.success(res.message || 'Task assigned successfully');
      reset();
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to assign task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this task?')) return;
    try {
      await deleteTask(id).unwrap();
      toast.success('Task revoked successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to revoke task');
    }
  };

  const tasks = tasksData?.data?.tasks || [];
  const staffMembers = staffData?.data?.staff || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Staff Duties & Task Manager
          </h1>
          <p className="text-muted-foreground text-sm">
            Assign, track, and manage school duties for staff members
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-auto py-1.5 text-xs font-semibold"
              disabled={isStaffLoading}
            >
              <ACTIONS.CREATE className="mr-2 h-4 w-4" /> Assign New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-105 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground text-base font-bold">
                Assign School Duty
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Create a task assignment for a staff member.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onTaskSubmit)}
              className="space-y-4 py-2"
            >
              {/* Staff Member Selection */}
              <div className="space-y-1">
                <Label
                  htmlFor="staff_member"
                  className="text-foreground text-xs font-semibold"
                >
                  Staff Member
                </Label>
                <Select
                  value={String(staffIdVal)}
                  onValueChange={(val) =>
                    setValue('staff_id', Number(val), { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Staff Member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((member) => (
                      <SelectItem
                        key={member.staff_id}
                        value={String(member.staff_id)}
                        className="text-xs"
                      >
                        {member.first_name} {member.last_name || ''} (
                        {member.department_name || 'Staff'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register('staff_id')} />
                {errors.staff_id && (
                  <p className="mt-0.5 text-[10px] text-red-500">
                    {errors.staff_id.message}
                  </p>
                )}
              </div>

              {/* Task Title */}
              <div className="space-y-1">
                <Label
                  htmlFor="title"
                  className="text-foreground text-xs font-semibold"
                >
                  Task Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Prepare Class Material"
                  className="h-9 text-xs"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="mt-0.5 text-[10px] text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <Label
                  htmlFor="due_date"
                  className="text-foreground text-xs font-semibold"
                >
                  Due Date
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  className="h-9 text-xs"
                  {...register('due_date')}
                />
                {errors.due_date && (
                  <p className="mt-0.5 text-[10px] text-red-500">
                    {errors.due_date.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label
                  htmlFor="description"
                  className="text-foreground text-xs font-semibold"
                >
                  Description / Instructions
                </Label>
                <Textarea
                  id="description"
                  placeholder="Write clear task instructions here..."
                  className="min-h-20 text-xs"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-0.5 text-[10px] text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    reset();
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-xs font-semibold"
                  disabled={isAssigning}
                >
                  {isAssigning ? 'Assigning...' : 'Assign Duty'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks List Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="text-foreground text-base font-semibold">
            Assigned Duties Log
          </CardTitle>
          <CardDescription>
            Monitor completion status of tasks assigned to school staff
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isTasksLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-muted h-8 animate-pulse rounded" />
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Staff Member
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Department
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Task Title
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Due Date
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right text-xs font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.task_id} className="hover:bg-muted/30">
                      <TableCell className="text-foreground text-xs font-semibold">
                        {task.staff_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {task.department_name || 'Staff'}
                      </TableCell>
                      <TableCell className="text-foreground text-xs font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground max-w-50 truncate text-xs"
                        title={task.description}
                      >
                        {task.description || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {task.due_date
                          ? formatDate(task.due_date, 'medium')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          className={`rounded-full border-none px-2 py-0.5 font-medium ${
                            task.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : task.status === 'in_progress'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {task.status
                            .replace('_', ' ')
                            .charAt(0)
                            .toUpperCase() +
                            task.status.replace('_', ' ').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 rounded p-0 text-slate-400 hover:text-red-500"
                          disabled={isDeleting}
                          onClick={() => handleDelete(task.task_id)}
                        >
                          <ACTIONS.DELETE className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <EMPTY_STATE.NO_DATA className="mb-2.5 h-10 w-10 text-slate-300" />
              <h3 className="text-foreground text-sm font-semibold">
                No Assigned Tasks
              </h3>
              <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                No duties have been assigned to staff members. Click "Assign New
                Task" to set a duty.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;

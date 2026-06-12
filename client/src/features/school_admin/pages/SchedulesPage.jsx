import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetStaffQuery } from '@/features/school_admin/staff.api';
import {
  useCreateStaffScheduleMutation,
  useDeleteStaffScheduleMutation,
  useListSchoolSchedulesQuery,
} from '@/features/staff/staffActivity.api';
import { ACTIONS, EMPTY_STATE } from '@/lib/icons';
import { createScheduleSchema } from '@/schemas/staff.schema';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SchedulesPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Queries
  const { data: schedulesData, isLoading: isSchedulesLoading } =
    useListSchoolSchedulesQuery();
  const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();

  // Mutations
  const [createSchedule, { isLoading: isCreating }] =
    useCreateStaffScheduleMutation();
  const [deleteSchedule, { isLoading: isDeleting }] =
    useDeleteStaffScheduleMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      staff_id: '',
      subject_name: '',
      class_name: '',
      day_of_week: 'Monday',
      start_time: '',
      end_time: '',
      room: '',
    },
  });

  const staffIdVal = watch('staff_id');
  const dayOfWeekVal = watch('day_of_week');

  const onScheduleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        // Make sure times have seconds format (e.g. HH:MM:00) if only HH:MM provided
        start_time:
          values.start_time.length === 5
            ? `${values.start_time}:00`
            : values.start_time,
        end_time:
          values.end_time.length === 5
            ? `${values.end_time}:00`
            : values.end_time,
      };

      const res = await createSchedule(payload).unwrap();
      toast.success(res.message || 'Timetable slot created successfully');
      reset();
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create timetable slot');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule entry?'))
      return;
    try {
      await deleteSchedule(id).unwrap();
      toast.success('Schedule entry deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete schedule entry');
    }
  };

  const schedules = schedulesData?.data?.schedules || [];
  const staffMembers = staffData?.data?.staff || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Staff Timetable Manager
          </h1>
          <p className="text-muted-foreground text-sm">
            Assign and manage weekly subject schedules for school staff
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-auto py-1.5 text-xs font-semibold"
              disabled={isStaffLoading}
            >
              <ACTIONS.CREATE className="mr-2 h-4 w-4" /> Add Timetable Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-105 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground text-base font-bold">
                Create Timetable Entry
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Configure a teaching session for a department staff member.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onScheduleSubmit)}
              className="space-y-4 py-2"
            >
              {/* Staff Dropdown */}
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

              <div className="grid grid-cols-2 gap-4">
                {/* Subject Name */}
                <div className="space-y-1">
                  <Label
                    htmlFor="subject_name"
                    className="text-foreground text-xs font-semibold"
                  >
                    Subject Name
                  </Label>
                  <Input
                    id="subject_name"
                    placeholder="e.g. Algebra I"
                    className="h-9 text-xs"
                    {...register('subject_name')}
                  />
                  {errors.subject_name && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      {errors.subject_name.message}
                    </p>
                  )}
                </div>

                {/* Class Grade */}
                <div className="space-y-1">
                  <Label
                    htmlFor="class_name"
                    className="text-foreground text-xs font-semibold"
                  >
                    Class Name / Grade
                  </Label>
                  <Input
                    id="class_name"
                    placeholder="e.g. Grade 10-A"
                    className="h-9 text-xs"
                    {...register('class_name')}
                  />
                  {errors.class_name && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      {errors.class_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Day of Week */}
                <div className="space-y-1">
                  <Label
                    htmlFor="day_of_week"
                    className="text-foreground text-xs font-semibold"
                  >
                    Day of the Week
                  </Label>
                  <Select
                    value={dayOfWeekVal}
                    onValueChange={(val) =>
                      setValue('day_of_week', val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day} className="text-xs">
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register('day_of_week')} />
                  {errors.day_of_week && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      {errors.day_of_week.message}
                    </p>
                  )}
                </div>

                {/* Room */}
                <div className="space-y-1">
                  <Label
                    htmlFor="room"
                    className="text-foreground text-xs font-semibold"
                  >
                    Room Number
                  </Label>
                  <Input
                    id="room"
                    placeholder="e.g. Room 104"
                    className="h-9 text-xs"
                    {...register('room')}
                  />
                  {errors.room && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      {errors.room.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="space-y-1">
                  <Label
                    htmlFor="start_time"
                    className="text-foreground text-xs font-semibold"
                  >
                    Start Time
                  </Label>
                  <Input
                    id="start_time"
                    type="time"
                    className="h-9 text-xs"
                    {...register('start_time')}
                  />
                  {errors.start_time && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      {errors.start_time.message}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div className="space-y-1">
                  <Label
                    htmlFor="end_time"
                    className="text-foreground text-xs font-semibold"
                  >
                    End Time
                  </Label>
                  <Input
                    id="end_time"
                    type="time"
                    className="h-9 text-xs"
                    {...register('end_time')}
                  />
                  {errors.end_time && (
                    <p className="mt-0.5 text-[10px] text-red-500">
                      {errors.end_time.message}
                    </p>
                  )}
                </div>
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
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Period'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable List Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="text-foreground text-base font-semibold">
            Weekly Schedule Records
          </CardTitle>
          <CardDescription>
            Timetable slots assigned across all staff members
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isSchedulesLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full animate-pulse" />
              ))}
            </div>
          ) : schedules.length > 0 ? (
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
                      Subject
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Class / Room
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Day
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Time Period
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right text-xs font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((item) => (
                    <TableRow
                      key={item.schedule_id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="text-foreground text-xs font-semibold">
                        {item.staff_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.department_name || 'Staff'}
                      </TableCell>
                      <TableCell className="text-foreground text-xs font-medium">
                        {item.subject_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.class_name}{' '}
                        {item.room ? `· Room ${item.room}` : ''}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {item.day_of_week}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {item.start_time.substring(0, 5)} -{' '}
                        {item.end_time.substring(0, 5)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 rounded p-0 text-slate-400 hover:text-red-500"
                          disabled={isDeleting}
                          onClick={() => handleDelete(item.schedule_id)}
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
                No Timetable Entries
              </h3>
              <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                No teaching schedules have been assigned. Click "Add Timetable
                Slot" to assign a session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulesPage;

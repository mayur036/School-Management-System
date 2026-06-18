import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  useCreateStaffScheduleMutation,
  useUpdateStaffScheduleMutation,
} from '@/features/school_admin/schedule.api';
import { scheduleSchema } from '@/schemas/schedule.schema';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ScheduleDialog = ({
  isOpen,
  setIsOpen,
  editingSchedule = null,
  staffMembers = [],
  periods = [],
  schedules = [],
  activeStaffId = '',
  activeDay = 'Monday',
  activePeriodId = '',
  onDelete,
}) => {
  // Mutations
  const [createSchedule, { isLoading: isCreating }] =
    useCreateStaffScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateStaffScheduleMutation();

  const [conflictWarning, setConflictWarning] = useState(null);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      staff_id: '',
      period_id: '',
      subject_name: '',
      class_name: '',
      day_of_week: 'Monday',
      room: '',
    },
  });

  const staffIdVal = watch('staff_id');
  const periodIdVal = watch('period_id');
  const dayOfWeekVal = watch('day_of_week');
  const roomVal = watch('room');

  // Load editing schedule or default prefilled values
  useEffect(() => {
    if (isOpen) {
      if (editingSchedule) {
        reset({
          staff_id: editingSchedule.staff_id,
          period_id: editingSchedule.period_id,
          subject_name: editingSchedule.subject_name,
          class_name: editingSchedule.class_name,
          day_of_week: editingSchedule.day_of_week,
          room: editingSchedule.room || '',
        });
      } else {
        reset({
          staff_id: activeStaffId || '',
          period_id: activePeriodId || '',
          subject_name: '',
          class_name: '',
          day_of_week: activeDay || 'Monday',
          room: '',
        });
      }
    }
  }, [
    isOpen,
    editingSchedule,
    activeStaffId,
    activeDay,
    activePeriodId,
    reset,
  ]);

  // Conflict detection
  useEffect(() => {
    if (!staffIdVal || !periodIdVal || !dayOfWeekVal) {
      setConflictWarning(null);
      return;
    }

    const period = periods.find((p) => p.period_id === Number(periodIdVal));
    const isBreak = period?.is_break;
    if (isBreak) {
      setConflictWarning({
        type: 'break',
        message: '⚠️ Cannot assign class to a break period.',
      });
      return;
    }

    // Filter out the current schedule item being edited
    const otherSchedules = schedules.filter(
      (s) => !editingSchedule || s.schedule_id !== editingSchedule.schedule_id
    );

    // 1. Teacher conflict (same staff + same day + same period)
    const teacherConf = otherSchedules.find(
      (s) =>
        s.staff_id === Number(staffIdVal) &&
        s.day_of_week === dayOfWeekVal &&
        s.period_id === Number(periodIdVal)
    );

    if (teacherConf) {
      setConflictWarning({
        type: 'teacher',
        message: `⚠️ Teacher Conflict: ${teacherConf.staff_name} already has ${teacherConf.subject_name} (${teacherConf.class_name}) during this period.`,
      });
      return;
    }

    // 2. Room conflict (same room + same day + same period)
    if (roomVal?.trim()) {
      const roomConf = otherSchedules.find(
        (s) =>
          s.room?.toLowerCase() === roomVal.trim().toLowerCase() &&
          s.day_of_week === dayOfWeekVal &&
          s.period_id === Number(periodIdVal)
      );

      if (roomConf) {
        setConflictWarning({
          type: 'room',
          message: `⚠️ Room Conflict: Room "${roomVal.trim()}" is already occupied by ${roomConf.staff_name} for ${roomConf.subject_name} (${roomConf.class_name}).`,
        });
        return;
      }
    }

    setConflictWarning(null);
  }, [
    staffIdVal,
    periodIdVal,
    dayOfWeekVal,
    roomVal,
    schedules,
    editingSchedule,
    periods,
  ]);

  const onScheduleSubmit = async (values) => {
    if (conflictWarning?.type === 'break') {
      toast.error('Cannot assign a class during a break period.');
      return;
    }

    try {
      if (editingSchedule) {
        const res = await updateSchedule({
          id: editingSchedule.schedule_id,
          ...values,
        }).unwrap();
        toast.success(res.message || 'Timetable slot updated successfully');
      } else {
        const res = await createSchedule(values).unwrap();
        toast.success(res.message || 'Timetable slot created successfully');
      }
      setIsOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save timetable slot');
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const classPeriods = periods.filter((p) => !p.is_break);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-105 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground text-base font-bold">
            {editingSchedule ? 'Edit Timetable Slot' : 'Create Timetable Slot'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Assign teaching subjects, classes, and rooms for staff members.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onScheduleSubmit)}
          className="space-y-4 py-2"
        >
          {/* Staff Selection */}
          <div className="space-y-1">
            <Label
              htmlFor="staff_member"
              className="text-foreground text-xs font-semibold"
            >
              Staff Member
            </Label>
            <Select
              value={staffIdVal ? String(staffIdVal) : undefined}
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
                Class / Grade
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
                placeholder="e.g. 104"
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

          {/* Period Selection */}
          <div className="space-y-1">
            <Label
              htmlFor="period_id"
              className="text-foreground text-xs font-semibold"
            >
              Period / Time Slot
            </Label>
            <Select
              value={periodIdVal ? String(periodIdVal) : undefined}
              onValueChange={(val) =>
                setValue('period_id', Number(val), { shouldValidate: true })
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                {classPeriods.map((period) => (
                  <SelectItem
                    key={period.period_id}
                    value={String(period.period_id)}
                    className="text-xs"
                  >
                    {period.period_name} ({period.start_time.substring(0, 5)} -{' '}
                    {period.end_time.substring(0, 5)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('period_id')} />
            {errors.period_id && (
              <p className="mt-0.5 text-[10px] text-red-500">
                {errors.period_id.message}
              </p>
            )}
          </div>

          {/* Conflict Warnings */}
          {conflictWarning && (
            <div
              className={`rounded-lg border p-3 text-[11px] leading-relaxed font-medium ${
                conflictWarning.type === 'break'
                  ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300'
              }`}
            >
              {conflictWarning.message}
            </div>
          )}

          <DialogFooter className="flex-row-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
            {editingSchedule && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="w-full text-xs font-semibold sm:mr-auto sm:w-auto"
                onClick={async () => {
                  await onDelete(editingSchedule.schedule_id);
                  setIsOpen(false);
                }}
              >
                Delete Slot
              </Button>
            )}
            <div className="flex w-full flex-col justify-end gap-2 sm:ml-auto sm:w-auto sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full text-xs sm:w-auto"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full text-xs font-semibold sm:w-auto"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? 'Saving...'
                  : editingSchedule
                    ? 'Save Changes'
                    : 'Create Slot'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

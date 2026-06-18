import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  useCreateSchoolPeriodMutation,
  useGetSchoolPeriodsQuery,
  useUpdateSchoolPeriodMutation,
} from '@/features/school_admin/schedule.api';
import { ACTIONS } from '@/lib/icons';
import { periodSchema } from '@/schemas/schedule.schema';

import PeriodsTable from './PeriodsTable';

export const PeriodManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

  // Queries & Mutations
  const { data: periodsData } = useGetSchoolPeriodsQuery();
  const [createPeriod, { isLoading: isCreating }] =
    useCreateSchoolPeriodMutation();
  const [updatePeriod, { isLoading: isUpdating }] =
    useUpdateSchoolPeriodMutation();

  const periods = periodsData?.data?.periods || [];

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(periodSchema),
    defaultValues: {
      period_name: '',
      period_order: '',
      start_time: '',
      end_time: '',
      is_break: false,
    },
  });

  const isBreakVal = watch('is_break');

  const openCreateDialog = () => {
    setEditingPeriod(null);
    reset({
      period_name: '',
      period_order: periods.length + 1,
      start_time: '',
      end_time: '',
      is_break: false,
    });
    setIsOpen(true);
  };

  const openEditDialog = (period) => {
    setEditingPeriod(period);
    reset({
      period_name: period.period_name,
      period_order: period.period_order,
      start_time: period.start_time.substring(0, 5),
      end_time: period.end_time.substring(0, 5),
      is_break: Boolean(period.is_break),
    });
    setIsOpen(true);
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        start_time:
          values.start_time.length === 5
            ? `${values.start_time}:00`
            : values.start_time,
        end_time:
          values.end_time.length === 5
            ? `${values.end_time}:00`
            : values.end_time,
      };

      if (editingPeriod) {
        const res = await updatePeriod({
          id: editingPeriod.period_id,
          ...payload,
        }).unwrap();
        toast.success(res.message || 'Period updated successfully');
      } else {
        const res = await createPeriod(payload).unwrap();
        toast.success(res.message || 'Period created successfully');
      }
      setIsOpen(false);
      reset();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save period');
    }
  };

  return (
    <>
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs">
        <div className="border-border bg-card border-b p-4.5">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-foreground text-sm font-bold tracking-tight">
                School Periods (Bell Schedule)
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs font-medium">
                Manage periods, class timings, and breaks for your school.
              </p>
            </div>
            <Button
              onClick={openCreateDialog}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors"
            >
              <ACTIONS.CREATE className="mr-1.5 size-4" /> Add Period
            </Button>
          </div>
        </div>

        <PeriodsTable onEdit={openEditDialog} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-96 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              {editingPeriod ? 'Edit Period' : 'Add Period'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Define the name, start/end timing and order for this schedule
              block.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              {/* Period Name */}
              <div className="space-y-1">
                <Label
                  htmlFor="period_name"
                  className="text-foreground text-xs font-semibold"
                >
                  Period Name
                </Label>
                <Input
                  id="period_name"
                  placeholder="e.g. Period 1"
                  className="h-9 text-xs"
                  {...register('period_name')}
                />
                {errors.period_name && (
                  <p className="text-[10px] text-red-500">
                    {errors.period_name.message}
                  </p>
                )}
              </div>

              {/* Period Order */}
              <div className="space-y-1">
                <Label
                  htmlFor="period_order"
                  className="text-foreground text-xs font-semibold"
                >
                  Period Order
                </Label>
                <Input
                  id="period_order"
                  type="number"
                  placeholder="e.g. 1"
                  className="h-9 text-xs"
                  {...register('period_order')}
                />
                {errors.period_order && (
                  <p className="text-[10px] text-red-500">
                    {errors.period_order.message}
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
                  <p className="text-[10px] text-red-500">
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
                  <p className="text-[10px] text-red-500">
                    {errors.end_time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Is Break Switch */}
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-2xs">
              <div className="space-y-0.5">
                <Label className="text-foreground text-xs font-semibold">
                  Break Period
                </Label>
                <p className="text-muted-foreground text-[10px]">
                  Check if this is a recess, lunch, or prayer break.
                </p>
              </div>
              <Switch
                checked={isBreakVal}
                onCheckedChange={(checked) => setValue('is_break', checked)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-9 text-xs font-semibold"
              >
                {isCreating || isUpdating
                  ? 'Saving...'
                  : editingPeriod
                    ? 'Save Changes'
                    : 'Add Period'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

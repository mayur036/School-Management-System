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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useCreateSchoolPeriodMutation,
  useDeleteSchoolPeriodMutation,
  useGetSchoolPeriodsQuery,
  useUpdateSchoolPeriodMutation,
} from '@/features/school_admin/schedule.api';
import { ACTIONS, EMPTY_STATE } from '@/lib/icons';
import { periodSchema } from '@/schemas/schedule.schema';

export const PeriodManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

  // Queries & Mutations
  const { data: periodsData, isLoading } = useGetSchoolPeriodsQuery();
  const [createPeriod, { isLoading: isCreating }] =
    useCreateSchoolPeriodMutation();
  const [updatePeriod, { isLoading: isUpdating }] =
    useUpdateSchoolPeriodMutation();
  const [deletePeriod, { isLoading: isDeleting }] =
    useDeleteSchoolPeriodMutation();

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

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this period? This will fail if schedules reference it.'
      )
    ) {
      return;
    }
    try {
      const res = await deletePeriod(id).unwrap();
      toast.success(res.message || 'Period deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete period');
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="border-border flex flex-row items-center justify-between border-b pb-3">
        <div>
          <CardTitle className="text-foreground text-base font-semibold">
            School Periods (Bell Schedule)
          </CardTitle>
          <CardDescription className="text-xs">
            Manage periods, class timings, and breaks for your school.
          </CardDescription>
        </div>
        <Button
          onClick={openCreateDialog}
          size="sm"
          className="h-8 text-xs font-semibold"
        >
          <ACTIONS.CREATE className="mr-1.5 h-3.5 w-3.5" /> Add Period
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2 py-4">
            <div className="bg-muted h-6 w-full animate-pulse rounded" />
            <div className="bg-muted h-6 w-full animate-pulse rounded" />
            <div className="bg-muted h-6 w-full animate-pulse rounded" />
          </div>
        ) : periods.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16 text-center text-xs font-semibold">
                    Order
                  </TableHead>
                  <TableHead className="text-xs font-semibold">Name</TableHead>
                  <TableHead className="text-xs font-semibold">
                    Start Time
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    End Time
                  </TableHead>
                  <TableHead className="w-24 text-center text-xs font-semibold">
                    Type
                  </TableHead>
                  <TableHead className="w-24 text-right text-xs font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((period) => (
                  <TableRow
                    key={period.period_id}
                    className="hover:bg-muted/30"
                  >
                    <TableCell className="text-center font-mono text-xs font-medium">
                      {period.period_order}
                    </TableCell>
                    <TableCell className="text-foreground text-xs font-semibold">
                      {period.period_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs font-medium">
                      {period.start_time.substring(0, 5)}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs font-medium">
                      {period.end_time.substring(0, 5)}
                    </TableCell>
                    <TableCell className="text-center">
                      {period.is_break ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-950/35 dark:text-amber-300">
                          Break
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-950/35 dark:text-blue-300">
                          Class
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-primary h-7 w-7 rounded p-0 text-slate-400"
                        onClick={() => openEditDialog(period)}
                      >
                        <ACTIONS.EDIT className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 rounded p-0 text-slate-400 hover:text-red-500"
                        disabled={isDeleting}
                        onClick={() => handleDelete(period.period_id)}
                      >
                        <ACTIONS.DELETE className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <EMPTY_STATE.NO_DATA className="mb-2 h-8 w-8 text-slate-300" />
            <h4 className="text-foreground text-sm font-semibold">
              No Periods Set
            </h4>
            <p className="text-muted-foreground mt-0.5 max-w-60 text-xs">
              Get started by defining your school schedule periods.
            </p>
          </div>
        )}
      </CardContent>

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
    </Card>
  );
};

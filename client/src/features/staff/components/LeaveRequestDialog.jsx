import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useRequestLeaveMutation } from '@/features/staff/staffActivity.api';
import { leaveRequestSchema } from '@/schemas/staff.schema';

import { LEAVE_TYPES } from '../constants/staffActivity.constants';

export const LeaveRequestDialog = ({ open, onOpenChange }) => {
  const [requestLeave, { isLoading: isSubmitting }] = useRequestLeaveMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leave_type: '',
      start_date: '',
      end_date: '',
      reason: '',
    },
  });

  const leaveTypeVal = watch('leave_type');

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onLeaveSubmit = async (values) => {
    try {
      const res = await requestLeave(values).unwrap();
      toast.success(res.message || 'Leave request submitted successfully');
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit leave request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-105 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground text-base font-bold">
            Apply for Leave
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Provide details below to submit your leave request to
            administration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onLeaveSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label
              htmlFor="leave_type"
              className="text-foreground text-xs font-semibold"
            >
              Leave Type
            </Label>
            <Select
              value={leaveTypeVal}
              onValueChange={(val) =>
                setValue('leave_type', val, { shouldValidate: true })
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select Leave Type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-xs">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('leave_type')} />
            {errors.leave_type && (
              <p className="mt-0.5 text-[10px] text-red-500">
                {errors.leave_type.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="start_date"
                className="text-foreground text-xs font-semibold"
              >
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                className="h-9 text-xs"
                {...register('start_date')}
              />
              {errors.start_date && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="end_date"
                className="text-foreground text-xs font-semibold"
              >
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                className="h-9 text-xs"
                {...register('end_date')}
              />
              {errors.end_date && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="reason"
              className="text-foreground text-xs font-semibold"
            >
              Reason / Notes
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide details about your leave request..."
              className="min-h-20 text-xs"
              {...register('reason')}
            />
            {errors.reason && (
              <p className="mt-0.5 text-[10px] text-red-500">
                {errors.reason.message}
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
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestDialog;

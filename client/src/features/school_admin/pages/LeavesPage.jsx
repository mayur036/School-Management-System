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
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import {
  useListSchoolLeaveRequestsQuery,
  useReviewLeaveRequestMutation,
} from '@/features/staff/staffActivity.api';
import { EMPTY_STATE } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import { reviewLeaveSchema } from '@/schemas/staff.schema';

export const LeavesPage = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Queries
  const { data: leavesData, isLoading: isLeavesLoading } =
    useListSchoolLeaveRequestsQuery();

  // Mutations
  const [reviewLeave, { isLoading: isSubmitting }] =
    useReviewLeaveRequestMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewLeaveSchema),
    defaultValues: {
      status: 'approved',
      comments: '',
    },
  });

  const statusVal = watch('status');

  const onReviewSubmit = async (values) => {
    if (!selectedLeave) return;
    try {
      const res = await reviewLeave({
        id: selectedLeave.leave_id,
        status: values.status,
        comments: values.comments,
      }).unwrap();
      toast.success(res.message || 'Leave request updated successfully');
      setIsOpen(false);
      setSelectedLeave(null);
      reset();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to review leave request');
    }
  };

  const handleOpenReview = (leave) => {
    setSelectedLeave(leave);
    reset({
      status: 'approved',
      comments: leave.comments || '',
    });
    setIsOpen(true);
  };

  const leaves = leavesData?.data?.leaves || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Staff Leave Requests
          </h1>
          <p className="text-muted-foreground text-sm">
            Review, approve, or reject absence requests submitted by staff
            members
          </p>
        </div>
        <div>
          <Badge className="border-none bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-500/10 dark:text-blue-400">
            {leaves.filter((l) => l.status === 'pending').length} Pending
            Requests
          </Badge>
        </div>
      </div>

      {/* Leaves Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="border-border border-b pb-3">
          <CardTitle className="text-foreground text-base font-semibold">
            Leave Application Log
          </CardTitle>
          <CardDescription>
            View historical and pending absence requests
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {isLeavesLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full animate-pulse" />
              ))}
            </div>
          ) : leaves.length > 0 ? (
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
                      Leave Type
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Duration
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Reason
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground text-xs font-semibold">
                      Reviewed By
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right text-xs font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow
                      key={leave.leave_id}
                      className="hover:bg-muted/30"
                    >
                      <TableCell className="text-foreground text-xs font-semibold">
                        {leave.first_name} {leave.last_name || ''}
                        <div className="text-muted-foreground text-[10px] font-normal">
                          {leave.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {leave.department_name || 'Staff'}
                      </TableCell>
                      <TableCell className="text-foreground text-xs font-medium">
                        {leave.leave_type}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <div>
                          {formatDate(leave.start_date, 'medium')} -{' '}
                          {formatDate(leave.end_date, 'medium')}
                        </div>
                        <div className="text-muted-foreground/80 mt-0.5 text-[10px] font-semibold">
                          {leave.total_days}{' '}
                          {leave.total_days === 1 ? 'day' : 'days'}
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground max-w-40 truncate text-xs"
                        title={leave.reason}
                      >
                        {leave.reason}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          className={`rounded-full border-none px-2 py-0.5 font-medium ${
                            leave.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400'
                              : leave.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400'
                                : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400'
                          }`}
                        >
                          {leave.status.charAt(0).toUpperCase() +
                            leave.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {leave.reviewer_name ? (
                          <div>
                            <span className="text-foreground font-medium">
                              {leave.reviewer_name}
                            </span>
                            {leave.comments && (
                              <div
                                className="text-muted-foreground max-w-32 truncate text-[10px]"
                                title={leave.comments}
                              >
                                "{leave.comments}"
                              </div>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {leave.status === 'pending' ? (
                          <Button
                            size="sm"
                            className="h-7 px-3 text-[11px] font-semibold"
                            onClick={() => handleOpenReview(leave)}
                          >
                            Review
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-[11px] font-medium">
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <EMPTY_STATE.NO_DATA className="text-muted-foreground/50 mb-2.5 h-10 w-10" />
              <h3 className="text-foreground text-sm font-semibold">
                No Leave Requests
              </h3>
              <p className="text-muted-foreground mt-0.5 max-w-65 text-xs">
                Staff members have not submitted any leave applications yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-100 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Review Absence Application
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Set decision and provide optional feedback or comments for{' '}
              {selectedLeave?.first_name} {selectedLeave?.last_name}.
            </DialogDescription>
          </DialogHeader>

          {selectedLeave && (
            <div className="bg-muted/40 border-border space-y-2 rounded-lg border p-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">
                    Leave Type
                  </span>
                  <span className="text-foreground font-semibold">
                    {selectedLeave.leave_type}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold uppercase">
                    Requested Period
                  </span>
                  <span className="text-foreground font-semibold">
                    {formatDate(selectedLeave.start_date, 'medium')} -{' '}
                    {formatDate(selectedLeave.end_date, 'medium')} (
                    {selectedLeave.total_days}{' '}
                    {selectedLeave.total_days === 1 ? 'day' : 'days'})
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-semibold uppercase">
                  Reason Statement
                </span>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{selectedLeave.reason}"
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onReviewSubmit)}
            className="space-y-4 py-1"
          >
            {/* Status Select */}
            <div className="space-y-1">
              <Label
                htmlFor="status"
                className="text-foreground text-xs font-semibold"
              >
                Decision Status
              </Label>
              <Select
                value={statusVal}
                onValueChange={(val) =>
                  setValue('status', val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved" className="text-xs">
                    Approve Leave
                  </SelectItem>
                  <SelectItem value="rejected" className="text-xs">
                    Reject Leave
                  </SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('status')} />
              {errors.status && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Comments Textarea */}
            <div className="space-y-1">
              <Label
                htmlFor="comments"
                className="text-foreground text-xs font-semibold"
              >
                Admin Comments / Explanation
              </Label>
              <Textarea
                id="comments"
                placeholder="Enter comments, guidelines, or rejection reason..."
                className="min-h-20 text-xs"
                {...register('comments')}
              />
              {errors.comments && (
                <p className="mt-0.5 text-[10px] text-red-500">
                  {errors.comments.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 text-xs"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedLeave(null);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`h-9 text-xs font-semibold ${
                  statusVal === 'rejected'
                    ? 'border-none bg-rose-600 text-white hover:bg-rose-700'
                    : 'border-none bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving Decision...'
                  : statusVal === 'rejected'
                    ? 'Reject Application'
                    : 'Approve Application'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeavesPage;

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import {
  useListSchoolLeaveRequestsQuery,
  useReviewLeaveRequestMutation,
} from '@/features/staff/staffActivity.api';
import { BASE } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import { reviewLeaveSchema } from '@/schemas/staff.schema';

import LeaveTable from '../components/leaves/LeaveTable';

export const LeavesPage = () => {
  // Controls State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Dialog state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Queries
  const { data: leavesData, isLoading: isLeavesLoading } =
    useListSchoolLeaveRequestsQuery({
      search: debouncedSearch,
      status: statusFilter,
      sort_by: sortBy,
      sort_order: sortOrder,
    }, { pollingInterval: 30000 });

  // Mutations
  const [reviewLeave, { isLoading: isSubmitting }] =
    useReviewLeaveRequestMutation();

  const leaves = useMemo(() => leavesData?.data?.leaves || [], [leavesData]);

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedLeaves = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return leaves.slice(start, start + itemsPerPage);
  }, [leaves, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setCurrentPage(1);
  };

  const onReviewSubmit = async (values) => {
    if (!selectedLeave) return;
    try {
      const res = await reviewLeave({
        id: selectedLeave.leave_id,
        status: values.status,
        comments: values.comments,
      }).unwrap();
      toast.success(res.message || 'Leave request updated successfully');
      setIsReviewOpen(false);
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
    setIsReviewOpen(true);
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'Leave Requests' },
        ]}
      />

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search Input Box & Filters */}
        <div className="flex flex-col gap-4 flex-1 max-w-4xl sm:flex-row sm:items-end">
          {/* Search */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Search Leave Requests
            </span>
            <div className="relative w-full">
              <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 w-full rounded-lg border py-2 pr-4 pl-9 text-xs outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type employee name or leave type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-48">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Status
            </span>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-card border-border text-foreground h-9 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Status</SelectItem>
                <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                <SelectItem value="approved" className="text-xs">Approved</SelectItem>
                <SelectItem value="rejected" className="text-xs">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Main Data View (Table) ────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <LeaveTable
          leaves={paginatedLeaves}
          isLoading={isLeavesLoading}
          onReview={handleOpenReview}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {!isLeavesLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={leaves.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="leave requests"
          />
        )}
      </div>

      {/* ── Review Dialog ─────────────────────────────────────── */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
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
                    {formatDate(selectedLeave.start_date, 'medium')} –{' '}
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
                  &quot;{selectedLeave.reason}&quot;
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
                  setIsReviewOpen(false);
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

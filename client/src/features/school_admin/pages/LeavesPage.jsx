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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  useListSchoolLeaveRequestsQuery,
  useReviewLeaveRequestMutation,
} from '@/features/staff/staffActivity.api';
import { useDataTable } from '@/hooks/useDataTable';
import { BASE } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import { reviewLeaveSchema } from '@/schemas/staff.schema';

import LeaveStatCard from '../components/leaves/LeaveStatCard';
import LeaveTable from '../components/leaves/LeaveTable';
import {
  computeLeaveStats,
  exportLeavesToCsv,
  getLeaveTypes,
} from '../utils/leaves.utils';

export const LeavesPage = () => {
  // Dialog state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Filter state
  const [typeFilter, setTypeFilter] = useState('all');

  // Queries
  const { data: leavesData, isLoading: isLeavesLoading } =
    useListSchoolLeaveRequestsQuery(undefined, { pollingInterval: 30000 });

  // Mutations
  const [reviewLeave, { isLoading: isSubmitting }] =
    useReviewLeaveRequestMutation();

  const leaves = useMemo(() => leavesData?.data?.leaves || [], [leavesData]);
  const leaveTypes = useMemo(() => getLeaveTypes(leaves), [leaves]);

  // Stats
  const stats = useMemo(() => computeLeaveStats(leaves), [leaves]);

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

  // Use the custom useDataTable hook for search, filters, pagination
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    filteredData: filteredLeaves,
    paginatedData: paginatedLeaves,
  } = useDataTable({
    data: leaves,
    searchFilter: (leave, q) => {
      // Department type filter
      const matchesType =
        typeFilter === 'all' || leave.leave_type === typeFilter;
      if (!matchesType) return false;

      const fullName = `${leave.first_name} ${leave.last_name}`.toLowerCase();
      const emailStr = (leave.email ?? '').toLowerCase();
      const deptStr = (leave.department_name ?? '').toLowerCase();
      const typeStr = (leave.leave_type ?? '').toLowerCase();
      const reasonStr = (leave.reason ?? '').toLowerCase();

      return (
        fullName.includes(q) ||
        emailStr.includes(q) ||
        deptStr.includes(q) ||
        typeStr.includes(q) ||
        reasonStr.includes(q)
      );
    },
  });

  // Reset page when typeFilter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, setCurrentPage]);

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

  const handleExport = () => {
    if (!filteredLeaves.length) {
      toast.error('No leave records found to export');
      return;
    }
    try {
      exportLeavesToCsv(filteredLeaves);
      toast.success('Leave records exported successfully');
    } catch {
      toast.error('Failed to export leave records');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Staff Leave Requests
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review, approve, or reject absence requests submitted by staff
            members.
          </p>
        </div>
      </div>

      {/* ── Stats Summary Grid ────────────────────────────────── */}
      <LeaveStatCard stats={stats} isLoading={isLeavesLoading} />

      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <BASE.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="bg-muted/40 border-border pl-9"
            placeholder="Search by name, email, department, or type..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-border bg-card cursor-pointer gap-2"
              >
                <BASE.FILTER data-icon="inline-start" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'all'}
                onCheckedChange={() => setStatusFilter('all')}
              >
                All Statuses
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'pending'}
                onCheckedChange={() => setStatusFilter('pending')}
              >
                Pending Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'approved'}
                onCheckedChange={() => setStatusFilter('approved')}
              >
                Approved Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'rejected'}
                onCheckedChange={() => setStatusFilter('rejected')}
              >
                Rejected Only
              </DropdownMenuCheckboxItem>

              {leaveTypes.length > 0 && (
                <>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuLabel>Filter Leave Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={typeFilter === 'all'}
                    onCheckedChange={() => setTypeFilter('all')}
                  >
                    All Types
                  </DropdownMenuCheckboxItem>
                  {leaveTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={typeFilter === type}
                      onCheckedChange={() => setTypeFilter(type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export CSV */}
          <Button
            variant="outline"
            className="border-border bg-card cursor-pointer gap-2"
            onClick={handleExport}
          >
            <BASE.DOWNLOAD data-icon="inline-start" />
            Export
          </Button>
        </div>
      </div>

      {/* ── Main Data View (Table) ────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <LeaveTable
          leaves={paginatedLeaves}
          isLoading={isLeavesLoading}
          onReview={handleOpenReview}
        />

        {!isLeavesLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={filteredLeaves.length}
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

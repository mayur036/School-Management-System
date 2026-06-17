import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import { ACTIONS, BASE } from '@/lib/icons';

import StaffDetailDrawer from '../components/staffs/StaffDetailDrawer';
import StaffStatusToggle from '../components/staffs/StaffStatusToggle';
import StaffTable from '../components/staffs/StaffTable';
import { useGetStaffQuery } from '../staff.api';

const StaffPage = () => {
  // Queries
  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useGetStaffQuery();

  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Active item states for dialogs & drawer details
  const [toggleMember, setToggleMember] = useState(null);
  const [detailMember, setDetailMember] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return staff.slice(start, start + itemsPerPage);
  }, [staff, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'Staff Directory' },
        ]}
      />

      {/* Page Title & Register Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Staff Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, manage, and register staff members for your departments.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2 shadow-sm transition-all"
        >
          <Link to="/school/staff/register">
            <ACTIONS.CREATE data-icon="inline-start" />
            Register Staff
          </Link>
        </Button>
      </div>

      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Grid / List Layout Switcher */}
          <div className="border-border bg-muted/40 hidden items-center rounded-lg border p-0.5 sm:flex">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 cursor-pointer rounded-md"
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <BASE.LIST_VIEW className="size-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 cursor-pointer rounded-md"
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <BASE.GRID_VIEW className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {staffError && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {staffError.message ||
            'Failed to load staff directory. Please try again.'}
        </div>
      )}

      {/* ── Main Data View (Table / Grid) ────────────────────── */}
      <div className="flex flex-col gap-4">
        <StaffTable
          staff={paginatedStaff}
          isLoading={staffLoading}
          viewMode={viewMode}
          onViewDetails={setDetailMember}
          onToggleStatus={setToggleMember}
        />

        {!staffLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={staff.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="staff members"
          />
        )}
      </div>

      {/* Status Toggle AlertDialog */}
      <StaffStatusToggle
        member={toggleMember}
        onClose={() => setToggleMember(null)}
      />

      {/* Staff Profile Detail Drawer */}
      <StaffDetailDrawer
        member={detailMember}
        open={!!detailMember}
        onClose={() => setDetailMember(null)}
      />
    </div>
  );
};

export default StaffPage;

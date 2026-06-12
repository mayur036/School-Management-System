import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDataTable } from '@/hooks/useDataTable';
import { ACTIONS, BASE } from '@/lib/icons';
import { formatStaffId } from '@/lib/utils';

import StaffDetailDrawer from '../components/staffs/StaffDetailDrawer';
import StaffStatCard from '../components/staffs/StaffStatCard';
import StaffStatusToggle from '../components/staffs/StaffStatusToggle';
import StaffTable from '../components/staffs/StaffTable';
import { useGetDepartmentsQuery } from '../departments.api';
import { useGetStaffQuery } from '../staff.api';
import { computeStaffStats, exportStaffToCsv } from '../utils/staff.utils';

const StaffPage = () => {
  // Queries
  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useGetStaffQuery();
  const { data: deptData } = useGetDepartmentsQuery();

  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);
  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );

  const [deptFilter, setDeptFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Active item states for dialogs & drawer details
  const [toggleMember, setToggleMember] = useState(null);
  const [detailMember, setDetailMember] = useState(null);

  // Real-time headline stats
  const stats = useMemo(
    () => computeStaffStats(staff, departments),
    [staff, departments]
  );

  // Use the custom useDataTable hook
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
    filteredData: filteredStaff,
    paginatedData: paginatedStaff,
  } = useDataTable({
    data: staff,
    searchFilter: (member, q) => {
      const matchesDept =
        deptFilter === 'all' || String(member.department_id) === deptFilter;
      if (!matchesDept) return false;

      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      const idStr = formatStaffId(member.staff_id);
      const emailStr = (member.email ?? '').toLowerCase();
      const deptStr = (member.department_name ?? '').toLowerCase();

      return (
        fullName.includes(q) ||
        idStr.includes(q) ||
        emailStr.includes(q) ||
        deptStr.includes(q)
      );
    },
  });

  // Reset page when deptFilter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [deptFilter, setCurrentPage]);

  const handleExport = () => {
    if (!filteredStaff.length) {
      toast.error('No staff records found to export');
      return;
    }
    try {
      exportStaffToCsv(filteredStaff);
      toast.success('Directory exported successfully');
    } catch {
      toast.error('Failed to export directory');
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

      {/* ── Stats Summary Grid ────────────────────────────────── */}
      <StaffStatCard stats={stats} isLoading={staffLoading} />

      {/* ── Controls & Actions Bar ────────────────────────────── */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <BASE.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="bg-muted/40 border-border pl-9"
            placeholder="Search staff by name, email, or department..."
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
                checked={statusFilter === 'active'}
                onCheckedChange={() => setStatusFilter('active')}
              >
                Active Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'inactive'}
                onCheckedChange={() => setStatusFilter('inactive')}
              >
                Inactive Only
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuLabel>Filter Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={deptFilter === 'all'}
                onCheckedChange={() => setDeptFilter('all')}
              >
                All Departments
              </DropdownMenuCheckboxItem>
              {departments.map((dept) => (
                <DropdownMenuCheckboxItem
                  key={dept.department_id}
                  checked={deptFilter === String(dept.department_id)}
                  onCheckedChange={() =>
                    setDeptFilter(String(dept.department_id))
                  }
                >
                  {dept.name}
                </DropdownMenuCheckboxItem>
              ))}
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
            totalItems={filteredStaff.length}
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

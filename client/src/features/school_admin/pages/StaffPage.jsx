import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BASE } from '@/lib/icons';

import StaffDetailDrawer from '../components/staffs/StaffDetailDrawer';
import StaffStatusToggle from '../components/staffs/StaffStatusToggle';
import StaffTable from '../components/staffs/StaffTable';
import { useGetDepartmentsQuery } from '../departments.api';
import { useGetStaffQuery } from '../staff.api';

const StaffPage = () => {
  // Controls State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Queries
  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useGetStaffQuery({
    search: debouncedSearch,
    department_id: deptFilter === 'all' ? 0 : Number(deptFilter),
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const { data: deptData } = useGetDepartmentsQuery();
  const departments = useMemo(() => deptData?.data?.departments ?? [], [deptData]);

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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
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

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        {/* Left: Search Input Box & Filters */}
        <div className="flex flex-col gap-4 flex-1 max-w-4xl sm:flex-row sm:items-end">
          {/* Search */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Search Employee
            </span>
            <div className="relative w-full">
              <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 w-full rounded-lg border py-2 pr-4 pl-9 text-xs outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type name, ID or designation..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-48">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Department
            </span>
            <Select
              value={deptFilter}
              onValueChange={(val) => {
                setDeptFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="bg-card border-border text-foreground h-9 text-xs">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.department_id} value={String(dept.department_id)} className="text-xs">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-36">
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
                <SelectItem value="active" className="text-xs">Active</SelectItem>
                <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: View Switcher + Action Button */}
        <div className="flex items-center gap-2 sm:shrink-0 sm:justify-end">
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

          {/* Action Button */}
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-9 flex-1 px-4 text-xs font-semibold rounded-lg shadow-xs transition-colors sm:flex-none"
          >
            <Link to="/school/staff/register">
              + Add New Employee
            </Link>
          </Button>
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
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
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

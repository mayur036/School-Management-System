import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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
import { useGetStaffQuery } from '@/features/school_admin/staff.api';
import { BASE } from '@/lib/icons';
import { cn } from '@/lib/utils';

import CreateDepartmentDialog from '../components/departments/CreateDepartmentDialog';
import DepartmentsGrid from '../components/departments/DepartmentsGrid';
import DepartmentsTable from '../components/departments/DepartmentsTable';
import DepartmentStatusToggle from '../components/departments/DepartmentStatusToggle';
import { useGetDepartmentsQuery } from '../departments.api';
import { countStaffByDepartmentId } from '../utils/staff.utils';

const DepartmentsPage = () => {
  // Controls State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Queries
  const {
    data: deptData,
    isLoading: deptLoading,
    error: deptError,
  } = useGetDepartmentsQuery({
    search: debouncedSearch,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  const { data: staffData } = useGetStaffQuery();

  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );
  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);

  const [createOpen, setCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [statusToggleDept, setStatusToggleDept] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Staff count per department + page summary metrics
  const staffCounts = useMemo(() => countStaffByDepartmentId(staff), [staff]);

  // Paginated records
  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return departments.slice(startIndex, startIndex + itemsPerPage);
  }, [departments, currentPage, itemsPerPage]);

  // Handle mock actions
  const handleEditDepartment = (dept) => {
    toast.info(`Editing "${dept.name}" will be available in a future release.`);
  };

  const handleDeleteDepartment = (dept) => {
    toast.info(
      `Deleting "${dept.name}" will be available in a future release.`
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1); // reset to first page
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
          { label: 'Departments' },
        ]}
      />

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search Input Box & Filter */}
        <div className="flex max-w-2xl flex-1 flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
              Search Department
            </span>
            <div className="relative w-full">
              <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                type="text"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-9 text-xs outline-none focus:ring-1"
                placeholder="Type department name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex w-full flex-col gap-1.5 sm:w-40">
            <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
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
                <SelectItem value="all" className="text-xs">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="text-xs">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="text-xs">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Action Button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors"
        >
          + Add Department
        </Button>
      </div>

      <CreateDepartmentDialog
        hideTrigger={true}
        externalOpen={createOpen}
        onExternalOpenChange={setCreateOpen}
      />

      {/* Error state */}
      {deptError && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {deptError.message || 'Failed to load departments. Please try again.'}
        </div>
      )}

      {/* Filters & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-muted/30 border-border flex items-center rounded-lg border p-0.5">
            {/* List layout mode */}
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(
                'size-7.5 cursor-pointer rounded-md p-0.5',
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground'
              )}
              title="List View"
            >
              <BASE.LIST_VIEW className="size-4" />
            </Button>
            {/* Grid layout mode */}
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(
                'size-7.5 cursor-pointer rounded-md p-0.5',
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground'
              )}
              title="Grid View"
            >
              <BASE.GRID_VIEW className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-4">
        {viewMode === 'list' ? (
          <DepartmentsTable
            departments={paginatedDepartments}
            staffCounts={staffCounts}
            isLoading={deptLoading}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
            onToggleStatus={setStatusToggleDept}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        ) : (
          <DepartmentsGrid
            departments={paginatedDepartments}
            staffCounts={staffCounts}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
            onToggleStatus={setStatusToggleDept}
          />
        )}

        {/* Global Pagination Controls */}
        {!deptLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={departments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="departments"
          />
        )}
      </div>

      {/* Status Toggle Dialog */}
      <DepartmentStatusToggle
        department={statusToggleDept}
        onClose={() => setStatusToggleDept(null)}
      />
    </div>
  );
};

export default DepartmentsPage;

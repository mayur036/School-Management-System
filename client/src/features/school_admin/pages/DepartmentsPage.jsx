import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import DepartmentsStatCard from '../components/departments/DepartmentsStatCard';
import DepartmentsTable from '../components/departments/DepartmentsTable';
import {
  DEPARTMENT_SORT_OPTIONS,
  DEPARTMENT_STATUS_FILTERS,
} from '../constants/departments.constants';
import { useGetDepartmentsQuery } from '../departments.api';
import { computeDepartmentStats } from '../utils/departments.utils';
import { countStaffByDepartmentId } from '../utils/staff.utils';

const DepartmentsPage = () => {
  // Queries
  const {
    data: deptData,
    isLoading: deptLoading,
    error: deptError,
  } = useGetDepartmentsQuery();
  const { data: staffData } = useGetStaffQuery();

  const departments = useMemo(
    () => deptData?.data?.departments ?? [],
    [deptData]
  );
  const staff = useMemo(() => staffData?.data?.staff ?? [], [staffData]);

  // Controls State
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('newest');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Staff count per department + page summary metrics
  const staffCounts = useMemo(() => countStaffByDepartmentId(staff), [staff]);
  const stats = useMemo(
    () => computeDepartmentStats(departments, staff),
    [departments, staff]
  );

  console.log(stats);

  // Filter and Sort Logic
  const processedDepartments = useMemo(() => {
    let result = departments.filter((dept) => {
      const name = (dept.name ?? '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = name.includes(q);

      const matchesStatus =
        statusFilter === 'all' || dept.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Apply Sorting
    result.sort((a, b) => {
      if (sortFilter === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortFilter === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortFilter === 'alphabetical-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortFilter === 'alphabetical-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [departments, searchQuery, statusFilter, sortFilter]);

  // Paginated records
  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedDepartments.slice(startIndex, startIndex + itemsPerPage);
  }, [processedDepartments, currentPage, itemsPerPage]);

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

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'School Admin', to: '/school/dashboard' },
          { label: 'Departments' },
        ]}
      />

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Departments
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage academic and administrative departments for your school.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <CreateDepartmentDialog
            externalOpen={createOpen}
            onExternalOpenChange={setCreateOpen}
          />
        </div>
      </div>

      {/* stats Summary Row */}
      <DepartmentsStatCard stats={stats} isLoading={deptLoading} />
      {/* Error state */}
      {deptError && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {deptError.message || 'Failed to load departments. Please try again.'}
        </div>
      )}

      {/* Filters & Actions Bar */}
      <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <BASE.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-muted/30 border-border h-9 rounded-lg pl-9 text-xs"
          />
        </div>

        {/* Filters dropdowns & toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="border-border bg-muted/20 h-9 w-30 rounded-lg text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENT_STATUS_FILTERS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort selection */}
          <Select
            value={sortFilter}
            onValueChange={(val) => {
              setSortFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="border-border bg-muted/20 h-9 w-32.5 rounded-lg text-xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENT_SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted/30 h-9 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
          >
            <BASE.FILTER className="size-3.5" />
            Filter
          </Button>

          <div className="bg-muted/30 border-border ml-2 flex items-center rounded-lg border p-0.5">
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
          />
        ) : (
          <DepartmentsGrid
            departments={paginatedDepartments}
            staffCounts={staffCounts}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
          />
        )}

        {/* Global Pagination Controls */}
        {!deptLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={processedDepartments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="departments"
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;

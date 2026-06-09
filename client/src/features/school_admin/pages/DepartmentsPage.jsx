import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetStaffQuery } from '@/features/school_admin/staff.api';
import { COMMON } from '@/lib/icons';
import { cn, formatDate } from '@/lib/utils';

import CreateDepartmentDialog from '../components/CreateDepartmentDialog';
import DepartmentsGrid from '../components/DepartmentsGrid';
import DepartmentsTable from '../components/DepartmentsTable';
import { useGetDepartmentsQuery } from '../departments.api';

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

  // 1. Calculate staff count per department
  const staffCounts = useMemo(() => {
    const counts = {};
    staff.forEach((s) => {
      if (s.department_id) {
        counts[s.department_id] = (counts[s.department_id] || 0) + 1;
      }
    });
    return counts;
  }, [staff]);

  // 2. Calculate Real-Time Page Summary Metrics
  const metrics = useMemo(() => {
    const totalDepts = departments.length;
    const totalStaff = staff.length;
    const avgStaff =
      totalDepts > 0 ? (totalStaff / totalDepts).toFixed(1) : '0.0';

    // Find latest added department
    let latestDeptName = 'None';
    let latestDeptDateStr = '—';
    if (departments.length > 0) {
      const sortedByDate = [...departments].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      latestDeptName = sortedByDate[0].name;
      latestDeptDateStr = formatDate(sortedByDate[0].created_at, 'short');
    }

    return {
      totalDepts,
      totalStaff,
      avgStaff,
      latestDeptName,
      latestDeptDateStr,
    };
  }, [departments, staff]);

  // 3. Filter and Sort Logic
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

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Departments */}
        <Card className="border-border bg-card border border-l-4 border-l-purple-500 shadow-xs">
          <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-3.5 sm:p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 sm:size-10 dark:bg-purple-500/20">
              <COMMON.BUILDING className="size-4 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-muted-foreground truncate text-[9px] font-semibold tracking-normal uppercase sm:text-xs sm:tracking-wider">
                Total Departments
              </span>
              <span className="text-foreground mt-0.5 truncate text-base font-bold sm:text-2xl">
                {metrics.totalDepts}
              </span>
              <span className="text-muted-foreground mt-0.5 hidden text-[9px] sm:block sm:text-[10px]">
                All active departments
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Staff */}
        <Card className="border-border bg-card border border-l-4 border-l-emerald-500 shadow-xs">
          <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-3.5 sm:p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 sm:size-10 dark:bg-emerald-500/20">
              <COMMON.USERS_GROUP className="size-4 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-muted-foreground truncate text-[9px] font-semibold tracking-normal uppercase sm:text-xs sm:tracking-wider">
                Total Staff
              </span>
              <span className="text-foreground mt-0.5 truncate text-base font-bold sm:text-2xl">
                {metrics.totalStaff}
              </span>
              <span className="text-muted-foreground mt-0.5 hidden text-[9px] sm:block sm:text-[10px]">
                Across all departments
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Average Staff */}
        <Card className="border-border bg-card border border-l-4 border-l-orange-500 shadow-xs">
          <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-3.5 sm:p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 sm:size-10 dark:bg-orange-500/20">
              <COMMON.FILE_TEXT className="size-4 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-muted-foreground truncate text-[9px] font-semibold tracking-normal uppercase sm:text-xs sm:tracking-wider">
                Average Staff
              </span>
              <span className="text-foreground mt-0.5 truncate text-base font-bold sm:text-2xl">
                {metrics.avgStaff}
              </span>
              <span className="text-muted-foreground mt-0.5 hidden text-[9px] sm:block sm:text-[10px]">
                Per department
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Latest Added */}
        <Card className="border-border bg-card border border-l-4 border-l-blue-500 shadow-xs">
          <CardContent className="flex flex-row items-center gap-2.5 p-2.5 sm:gap-3.5 sm:p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 sm:size-10 dark:bg-blue-500/20">
              <COMMON.CALENDAR className="size-4 sm:size-5" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-muted-foreground truncate text-[9px] font-semibold tracking-normal uppercase sm:text-xs sm:tracking-wider">
                Latest Added
              </span>
              <span className="text-foreground mt-0.5 truncate text-xs font-bold sm:text-lg">
                {metrics.latestDeptName}
              </span>
              <span className="text-muted-foreground mt-0.5 hidden text-[9px] sm:block sm:text-[10px]">
                {metrics.latestDeptDateStr}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

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
          <COMMON.SEARCH className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
              <SelectItem value="newest">Sort: Newest</SelectItem>
              <SelectItem value="oldest">Sort: Oldest</SelectItem>
              <SelectItem value="alphabetical-asc">Sort: Name A-Z</SelectItem>
              <SelectItem value="alphabetical-desc">Sort: Name Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted/30 h-9 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
          >
            <COMMON.FILTER className="size-3.5" />
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
              <COMMON.LIST_VIEW className="size-4" />
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
              <COMMON.GRID_VIEW className="size-4" />
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

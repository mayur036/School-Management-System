import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
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

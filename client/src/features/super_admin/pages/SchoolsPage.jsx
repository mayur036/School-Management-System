import { useMemo, useState } from 'react';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import { ACTIONS } from '@/lib/icons';

import CreateSchoolAdminDialog from '../components/schools/CreateSchoolAdminDialog';
import CreateSchoolDialog from '../components/schools/CreateSchoolDialog';
import EditSchoolDialog from '../components/schools/EditSchoolDialog';
import SchoolsTable from '../components/schools/SchoolsTable';
import SchoolStatusToggle from '../components/schools/SchoolStatusToggle';
import { useGetSchoolsQuery } from '../schools.api';

const SchoolsPage = () => {
  // Queries
  const { data, isLoading, error } = useGetSchoolsQuery();
  const schools = useMemo(() => data?.data?.schools ?? [], [data]);

  // Dialog states
  const [statusSchool, setStatusSchool] = useState(null);
  const [adminSchool, setAdminSchool] = useState(null);
  const [editSchool, setEditSchool] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedSchools = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return schools.slice(start, start + itemsPerPage);
  }, [schools, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumbs */}
      <AppBreadcrumb
        items={[
          { label: 'Super Admin', to: '/super/dashboard' },
          { label: 'Schools Management' },
        ]}
      />

      {/* Page Title & Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Schools Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, manage, and register new schools on the platform.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer gap-2 shadow-sm transition-all"
        >
          <ACTIONS.CREATE data-icon="inline-start" />
          Register School
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {error.message || 'Failed to load schools. Please try again.'}
        </div>
      )}

      {/* ── Main Data View (Table) ────────────────────── */}
      <div className="flex flex-col gap-4">
        <SchoolsTable
          schools={paginatedSchools}
          isLoading={isLoading}
          onToggleStatus={setStatusSchool}
          onAddAdmin={setAdminSchool}
          onEditSchool={setEditSchool}
        />

        {!isLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={schools.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="schools"
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateSchoolDialog
        externalOpen={createOpen}
        onExternalOpenChange={setCreateOpen}
      />
      <EditSchoolDialog
        school={editSchool}
        onClose={() => setEditSchool(null)}
      />
      <SchoolStatusToggle
        school={statusSchool}
        onClose={() => setStatusSchool(null)}
      />
      <CreateSchoolAdminDialog
        school={adminSchool}
        onClose={() => setAdminSchool(null)}
      />
    </div>
  );
};

export default SchoolsPage;

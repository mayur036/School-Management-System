import { useMemo, useState } from 'react';

import AppBreadcrumb from '@/components/shared/AppBreadcrumb';
import AppPagination from '@/components/shared/AppPagination';
import { Button } from '@/components/ui/button';
import { BASE } from '@/lib/icons';

import AdminsTable from '../components/admins/AdminsTable';
import AdminStatusToggle from '../components/admins/AdminStatusToggle';
import DeleteAdminAlert from '../components/admins/DeleteAdminAlert';
import { useGetSchoolAdminsQuery } from '../schoolAdmins.api';

const AdminsPage = () => {
  const { data, isLoading, error } = useGetSchoolAdminsQuery();
  const admins = useMemo(() => data?.data?.admins ?? [], [data]);

  // Dialog states
  const [statusAdmin, setStatusAdmin] = useState(null);
  const [deleteAdmin, setDeleteAdmin] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return admins.slice(start, start + itemsPerPage);
  }, [admins, currentPage, itemsPerPage]);

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
          { label: 'School Admins' },
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            School Admins
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage administrators across all registered schools.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 w-fit cursor-pointer gap-2 rounded-xl font-semibold text-white shadow-sm">
          <BASE.PLUS className="size-4" />
          Register Admin
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          {error.message || 'Failed to load school admins. Please try again.'}
        </div>
      )}

      {/* ── Main Data View (Table) ────────────────────── */}
      <div className="flex flex-col gap-4">
        <AdminsTable
          admins={paginatedAdmins}
          isLoading={isLoading}
          onToggleStatus={setStatusAdmin}
          onDeleteAdmin={setDeleteAdmin}
        />

        {!isLoading && (
          <AppPagination
            currentPage={currentPage}
            totalItems={admins.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsLabel="admins"
          />
        )}
      </div>

      {/* Dialogs */}
      <AdminStatusToggle
        admin={statusAdmin}
        onClose={() => setStatusAdmin(null)}
      />
      <DeleteAdminAlert
        admin={deleteAdmin}
        onClose={() => setDeleteAdmin(null)}
      />
    </div>
  );
};

export default AdminsPage;

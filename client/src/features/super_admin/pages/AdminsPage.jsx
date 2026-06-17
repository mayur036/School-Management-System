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

      {/* Search & Actions Bar (eSkooly style) */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search Input Box */}
        <div className="flex w-full max-w-md flex-1 flex-col gap-1.5">
          <span className="text-muted-foreground/80 text-[10px] font-bold tracking-wider uppercase">
            Search Admin
          </span>
          <div className="relative w-full">
            <BASE.SEARCH className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="text"
              className="bg-card border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-primary w-full cursor-not-allowed rounded-lg border py-2 pr-4 pl-9 text-xs opacity-75 outline-none focus:ring-1"
              placeholder="Type admin name, email or school..."
              disabled
            />
          </div>
        </div>

        {/* Right: Action Button */}
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-semibold shadow-xs transition-colors">
          + Register Admin
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
